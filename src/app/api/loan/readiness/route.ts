import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FinancialProfileMetrics, assessLoanReadiness } from "@/lib/financialMath";
import { LoanReadinessInputSchema } from "@/lib/types";

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
    const validated = LoanReadinessInputSchema.parse(body);

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

    const assessment = assessLoanReadiness(
      metrics,
      validated.desiredAmount,
      validated.tenureMonths,
      validated.interestRate
    );

    // Record loan scenario evaluation
    await prisma.loanScenario.create({
      data: {
        userId,
        loanType: validated.loanType,
        desiredAmount: validated.desiredAmount,
        tenureMonths: validated.tenureMonths,
        interestRate: validated.interestRate,
        estimatedEMI: assessment.estimatedEMI,
        readinessStatus: assessment.status,
        dtiRatio: assessment.totalNewDti,
        assessmentReason: assessment.reasons.join(" | "),
      },
    });

    return NextResponse.json({
      assessment,
      metrics,
    });
  } catch (err: any) {
    console.error("Loan readiness API error:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to evaluate loan readiness" }, { status: 500 });
  }
}
