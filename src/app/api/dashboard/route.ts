import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateHealthScore, FinancialProfileMetrics } from "@/lib/financialMath";
import { analyzeBehaviorPatterns } from "@/lib/ruleEngine";
import aiService from "@/lib/aiService";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = (session?.user as any)?.id;

    // Fallback to Early Warning demo user if unauthenticated demo viewer
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
        scores: { orderBy: { date: "desc" }, take: 1 },
        debts: { where: { status: "ACTIVE" } },
        behaviorSignals: { where: { isDismissed: false }, take: 5 },
        notifications: { where: { isRead: false }, take: 5 },
        transactions: { orderBy: { date: "desc" }, take: 8 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latestSnapshot = user.snapshots[0];
    const totalDebt = user.debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const activeDebtObligations = user.debts.reduce((sum, d) => sum + d.monthlyEMI, 0);

    const monthlyIncome = latestSnapshot?.monthlyIncome ?? (user.profile?.monthlyIncome || 50000);
    const monthlyExpenses = latestSnapshot?.monthlyExpenses ?? 31500;
    const monthlySavings = latestSnapshot?.monthlySavings ?? 8500;
    const debtObligations = activeDebtObligations || (latestSnapshot?.debtObligations ?? 10000);
    const emergencyBuffer = latestSnapshot?.emergencyBuffer ?? 42000;
    const discretionarySpending = latestSnapshot?.discretionarySpending ?? 10800;
    const essentialSpending = latestSnapshot?.essentialSpending ?? 20700;
    const savingsRate = latestSnapshot?.savingsRate ?? (monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0.17);

    const metrics: FinancialProfileMetrics = {
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate,
      debtObligations,
      totalDebt,
      emergencyBuffer,
      discretionarySpending,
      essentialSpending,
      recurringSubscriptions: 2340,
      creditCardUsage: 9500,
    };

    // Calculate deterministic health score
    const healthResult = calculateHealthScore(metrics);

    // Analyze behavioral patterns
    const behaviorAnalysis = analyzeBehaviorPatterns(metrics);

    // Generate today's next best actions
    const nextActions = await aiService.generateNextAction({
      profileName: user.name,
      metrics,
      health: healthResult,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        occupation: user.profile?.occupation,
      },
      metrics: {
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        debtObligations,
        emergencyBuffer,
        discretionarySpending,
        essentialSpending,
        totalDebt,
        savingsRate,
      },
      health: healthResult,
      behaviorSignals: behaviorAnalysis.signals,
      financialDna: {
        primary: behaviorAnalysis.primaryDna,
        secondary: behaviorAnalysis.secondaryDna,
      },
      nextActions,
      recentTransactions: user.transactions,
      notifications: user.notifications,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
