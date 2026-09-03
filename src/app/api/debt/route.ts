import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateDebtRecoveryStrategies } from "@/lib/financialMath";

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
        recoveryPlans: {
          where: { status: "ACTIVE" },
          include: { actions: { orderBy: { order: "asc" } } },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const latest = user.snapshots[0];
    const debts = user.debts;

    const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const monthlyDebtPayments = debts.reduce((sum, d) => sum + d.monthlyEMI, 0);
    const estimatedAnnualInterest = debts.reduce(
      (sum, d) => sum + d.remainingAmount * (d.interestRate / 100),
      0
    );

    const essentialExpenses = latest?.essentialSpending || 20700;
    const availableCash = (latest?.monthlyIncome || 50000) - (latest?.monthlyExpenses || 31500) - monthlyDebtPayments;
    const emergencyBuffer = latest?.emergencyBuffer || 42000;

    const debtItems = debts.map((d) => ({
      id: d.id,
      name: d.name,
      creditor: d.creditor,
      totalAmount: d.totalAmount,
      remainingAmount: d.remainingAmount,
      interestRate: d.interestRate,
      monthlyEMI: d.monthlyEMI,
    }));

    const strategies = calculateDebtRecoveryStrategies(debtItems, Math.max(availableCash, 3000));

    return NextResponse.json({
      summary: {
        totalDebt,
        monthlyDebtPayments,
        estimatedAnnualInterest: Math.round(estimatedAnnualInterest),
        essentialExpenses,
        availableCash: Math.round(availableCash),
        emergencyBuffer,
      },
      debts,
      strategies,
      activePlan: user.recoveryPlans[0] || null,
    });
  } catch (err) {
    console.error("Debt API GET error:", err);
    return NextResponse.json({ error: "Failed to fetch debt information" }, { status: 500 });
  }
}
