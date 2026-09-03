import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FinancialProfileMetrics } from "@/lib/financialMath";
import { analyzeBehaviorPatterns } from "@/lib/ruleEngine";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        snapshots: { orderBy: { date: "desc" }, take: 1 },
        debts: { where: { status: "ACTIVE" } },
        behaviorSignals: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    const result = analyzeBehaviorPatterns(metrics);

    return NextResponse.json({
      primaryTrait: result.primaryDna,
      secondaryTrait: result.secondaryDna,
      allTraits: result.traits,
      behaviorSignals: result.signals,
    });
  } catch (err) {
    console.error("Financial DNA API error:", err);
    return NextResponse.json({ error: "Failed to generate Financial DNA" }, { status: 500 });
  }
}
