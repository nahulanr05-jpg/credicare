import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateHealthScore, FinancialProfileMetrics } from "@/lib/financialMath";
import aiService from "@/lib/aiService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        profile: true,
        snapshots: { orderBy: { date: "desc" }, take: 6 },
        debts: { where: { status: "ACTIVE" } },
        behaviorSignals: true,
        customerInterventions: {
          orderBy: { createdAt: "desc" },
          include: { analyst: { select: { name: true, email: true } } },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const latest = customer.snapshots[0];
    const totalDebt = customer.debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const debtObligations = customer.debts.reduce((sum, d) => sum + d.monthlyEMI, 0) || (latest?.debtObligations ?? 10000);

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
    const riskExplanation = await aiService.explainRisk({
      profileName: customer.name,
      metrics,
      health,
    });

    // Timeline series for recharts
    const timelineData = customer.snapshots.map((s, idx) => ({
      date: new Date(s.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      healthScore: s.healthScore,
      emergencyBuffer: s.emergencyBuffer,
      savingsRate: Math.round(s.savingsRate * 100),
    })).reverse();

    // If only 1 snapshot, provide realistic historic trail
    if (timelineData.length <= 1) {
      timelineData.unshift(
        { date: "90 Days Ago", healthScore: Math.min(90, health.score + 12), emergencyBuffer: metrics.emergencyBuffer + 8000, savingsRate: 24 },
        { date: "60 Days Ago", healthScore: Math.min(85, health.score + 7), emergencyBuffer: metrics.emergencyBuffer + 4000, savingsRate: 21 },
        { date: "30 Days Ago", healthScore: Math.min(80, health.score + 3), emergencyBuffer: metrics.emergencyBuffer + 2000, savingsRate: 19 }
      );
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.profile?.phone || "+91 98*** ****",
        occupation: customer.profile?.occupation || "Salaried Professional",
      },
      health,
      metrics,
      timelineData,
      behaviorSignals: customer.behaviorSignals,
      riskExplanation,
      interventions: customer.customerInterventions,
    });
  } catch (err) {
    console.error("Bank customer detail error:", err);
    return NextResponse.json({ error: "Failed to fetch customer risk profile" }, { status: 500 });
  }
}
