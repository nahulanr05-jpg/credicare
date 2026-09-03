import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FinancialProfileMetrics, calculateHealthScore } from "@/lib/financialMath";
import aiService from "@/lib/aiService";
import { ChatInputSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { email: "earlywarning@demo.com" },
      });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = ChatInputSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        snapshots: { orderBy: { date: "desc" }, take: 1 },
        debts: { where: { status: "ACTIVE" } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retrieve or create conversation
    let conversation = await prisma.aIConversation.findFirst({
      where: { userId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          title: "Financial Firewall AI Advisory",
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: validated.message,
      },
    });

    const latest = user.snapshots[0];
    const totalDebt = user.debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const debtObligations = user.debts.reduce((sum, d) => sum + d.monthlyEMI, 0) || (latest?.debtObligations ?? 10000);

    const metrics: FinancialProfileMetrics = {
      monthlyIncome: latest?.monthlyIncome ?? 50000,
      monthlyExpenses: latest?.monthlyExpenses ?? 31500,
      monthlySavings: latest?.monthlySavings ?? 8500,
      savingsRate: latest?.savingsRate ?? 0.17,
      debtObligations,
      totalDebt,
      emergencyBuffer: latest?.emergencyBuffer ?? 42000,
      discretionarySpending: latest?.discretionarySpending ?? 10800,
      essentialSpending: latest?.essentialSpending ?? 20700,
      recurringSubscriptions: 2340,
      creditCardUsage: 9500,
    };

    const health = calculateHealthScore(metrics);

    // Call AIService with context and history
    const history = conversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await aiService.chatWithCustomer(
      validated.message,
      history,
      {
        profileName: user.name,
        metrics,
        health,
      }
    );

    // Save assistant reply
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: reply,
      },
    });

    return NextResponse.json({
      reply,
      messageId: assistantMsg.id,
      conversationId: conversation.id,
    });
  } catch (err: any) {
    console.error("AI Chat API error:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "AI Coach response error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { email: "earlywarning@demo.com" },
      });
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await prisma.aIConversation.findFirst({
      where: { userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json({
      messages: conversation?.messages || [],
      conversationId: conversation?.id || null,
    });
  } catch (err) {
    console.error("Chat GET error:", err);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}
