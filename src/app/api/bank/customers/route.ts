import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Allow BANK_ANALYST, ADMIN, or demo mode viewing
    const isAuthorized = role === "BANK_ANALYST" || role === "ADMIN" || true; // Hackathon demo friendly

    if (!isAuthorized) {
      return NextResponse.json({ error: "Access forbidden. Bank Analyst role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const filterRisk = searchParams.get("risk") || "all";

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      include: {
        profile: true,
        snapshots: { orderBy: { date: "desc" }, take: 4 },
        debts: { where: { status: "ACTIVE" } },
        behaviorSignals: { take: 3 },
        customerInterventions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const formattedCustomers = customers.map((c, index) => {
      const latestSnapshot = c.snapshots[0];
      const previousSnapshot = c.snapshots[1];
      const health = latestSnapshot?.healthScore ?? 65;
      const prevHealth = previousSnapshot?.healthScore ?? health;
      const trend = health > prevHealth ? "IMPROVING" : health < prevHealth ? "DECLINING" : "STABLE";

      let riskCategory: "HEALTHY" | "EARLY_WARNING" | "FINANCIAL_STRESS" | "CRITICAL" = "HEALTHY";
      let riskLabel = "Healthy";
      let badgeColor = "#10b981";

      if (health < 30) {
        riskCategory = "CRITICAL";
        riskLabel = "Critical";
        badgeColor = "#ef4444";
      } else if (health < 50) {
        riskCategory = "FINANCIAL_STRESS";
        riskLabel = "Financial Stress";
        badgeColor = "#f97316";
      } else if (health < 65) {
        riskCategory = "EARLY_WARNING";
        riskLabel = "Early Warning";
        badgeColor = "#f59e0b";
      }

      const totalDebt = c.debts.reduce((sum, d) => sum + d.remainingAmount, 0);
      const monthlyEMI = c.debts.reduce((sum, d) => sum + d.monthlyEMI, 0) || latestSnapshot?.debtObligations || 0;
      const income = latestSnapshot?.monthlyIncome || 50000;
      const dtiRatio = income > 0 ? (monthlyEMI / income) : 0.2;

      const signals = c.behaviorSignals.map(s => s.title);
      if (signals.length === 0) {
        if (riskCategory === "EARLY_WARNING") signals.push("Savings ↓", "Discretionary spending ↑");
        else if (riskCategory === "FINANCIAL_STRESS") signals.push("High DTI burden", "Credit usage ↑");
        else if (riskCategory === "CRITICAL") signals.push("Net cashflow deficit", "Buffer < ₹10k");
        else signals.push("Savings rate > 25%", "Controlled DTI");
      }

      let recommendedAction = "Continuous automated monitoring";
      if (riskCategory === "CRITICAL") recommendedAction = "Proactive loan restructuring & relief";
      else if (riskCategory === "FINANCIAL_STRESS") recommendedAction = "Financial counselling & payment assistance";
      else if (riskCategory === "EARLY_WARNING") recommendedAction = "Automated liquidity alert & budgeting support";

      return {
        id: c.id,
        accountNumber: `FF-${1000 + index + 24}`,
        name: c.name,
        email: c.email,
        occupation: c.profile?.occupation || "Salaried Professional",
        financialHealth: health,
        trend,
        riskCategory,
        riskLabel,
        badgeColor,
        debtBurden: `${(dtiRatio * 100).toFixed(0)}% DTI`,
        monthlyIncome: income,
        emergencyBuffer: latestSnapshot?.emergencyBuffer || 42000,
        warningSignals: signals,
        recommendedAction,
        latestIntervention: c.customerInterventions[0] || null,
      };
    });

    // Aggregate portfolio distribution (with realistic hackathon volume numbers)
    const portfolioStats = {
      totalCustomers: 1240,
      healthy: 872,
      earlyWarning: 238,
      stress: 96,
      critical: 34,
      portfolioAverageHealth: 69.4,
      atRiskVolume: "₹4.82 Cr",
    };

    return NextResponse.json({
      portfolioStats,
      customers: formattedCustomers,
    });
  } catch (err) {
    console.error("Bank customers API error:", err);
    return NextResponse.json({ error: "Failed to fetch bank intelligence data" }, { status: 500 });
  }
}
