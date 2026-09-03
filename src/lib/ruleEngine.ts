/**
 * Behavioral Spending & Financial DNA Rules Engine
 * Deterministic detection of warning signals, habits, and financial traits.
 * Neutral, non-shaming tone and transparent explainability.
 */

import { FinancialProfileMetrics } from "./financialMath";

export interface DetectedBehaviorSignal {
  pattern: 
    | "SALARY_CYCLE_SPIKE"
    | "SAVINGS_DECLINE"
    | "LIFESTYLE_INFLATION"
    | "SUBSCRIPTION_ACCUMULATION"
    | "CREDIT_DEPENDENCY"
    | "IRREGULAR_SPENDING";
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidence: string;
  impact: string;
  recommendation: string;
}

export interface FinancialDNATrait {
  trait: 
    | "Salary-Cycle Spender"
    | "Steady Saver"
    | "Impulse Spender"
    | "Subscription Heavy"
    | "Debt-Conservative"
    | "Credit Dependent"
    | "Irregular Spender"
    | "Emergency-Prepared";
  category: "PRIMARY" | "SECONDARY" | "SUPPORTING";
  description: string;
  evidence: string;
  recommendedInterventionStyle: string;
  badgeColor: string;
}

export interface SpendingEngineResult {
  signals: DetectedBehaviorSignal[];
  primaryDna: FinancialDNATrait;
  secondaryDna: FinancialDNATrait;
  traits: FinancialDNATrait[];
}

export function analyzeBehaviorPatterns(
  metrics: FinancialProfileMetrics,
  historicalMonths: Array<{ month: string; savingsRate: number; discretionary: number; income: number }> = [],
  firstWeekSpendPercentage: number = 42 // % of monthly spend in first 7 days post-salary
): SpendingEngineResult {
  const signals: DetectedBehaviorSignal[] = [];
  const traits: FinancialDNATrait[] = [];

  const {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    recurringSubscriptions,
    creditCardUsage,
    emergencyBuffer,
    debtObligations,
    discretionarySpending,
  } = metrics;

  // 1. Salary-Cycle Spending Spike
  if (firstWeekSpendPercentage > 30) {
    const spikeMagnitude = Math.round(firstWeekSpendPercentage - 25);
    signals.push({
      pattern: "SALARY_CYCLE_SPIKE",
      title: "Salary-Cycle Spending Spike",
      severity: firstWeekSpendPercentage > 45 ? "HIGH" : "MEDIUM",
      evidence: `Your spending during the first week after salary credit is ${firstWeekSpendPercentage}% of your entire monthly outflow (${spikeMagnitude}% above uniform distribution).`,
      impact: "Accelerated cash depletion early in the billing cycle puts end-of-month savings commitments at severe risk.",
      recommendation: "Automate your monthly savings target transfer to a separate vault on Day 1, ensuring baseline capital is protected before discretionary outlays occur."
    });

    traits.push({
      trait: "Salary-Cycle Spender",
      category: "PRIMARY",
      description: "Allocates a disproportionate volume of non-essential expenditure in the immediate days following compensation receipt.",
      evidence: `${firstWeekSpendPercentage}% of monthly expenditure takes place in days 1-7.`,
      recommendedInterventionStyle: "Rule-based automated sweeps and scheduled liquidity caps immediately upon credit.",
      badgeColor: "#f59e0b"
    });
  }

  // 2. Savings Decline (check consecutive trend)
  const isDecliningSavings = historicalMonths.length >= 3 
    ? historicalMonths.slice(-3).every((m, idx, arr) => idx === 0 || m.savingsRate <= arr[idx - 1].savingsRate)
    : savingsRate < 0.12;

  if (isDecliningSavings) {
    signals.push({
      pattern: "SAVINGS_DECLINE",
      title: "Consecutive Savings Erosion",
      severity: savingsRate < 0.08 ? "HIGH" : "MEDIUM",
      evidence: `Your active savings rate has compressed to ${(savingsRate * 100).toFixed(1)}% of net monthly earnings across recent review cycles.`,
      impact: "Progressive weakening of liquidity reserves diminishes your margin of safety for future shocks.",
      recommendation: "Implement a micro-savings ceiling and review discretionary subscriptions to halt further reserve contraction."
    });
  }

  // 3. Lifestyle Inflation
  const discretionaryShare = monthlyIncome > 0 ? discretionarySpending / monthlyIncome : 0;
  if (discretionaryShare > 0.30) {
    signals.push({
      pattern: "LIFESTYLE_INFLATION",
      title: "Discretionary Expansion (Lifestyle Inflation)",
      severity: discretionaryShare > 0.40 ? "HIGH" : "MEDIUM",
      evidence: `Discretionary purchases currently absorb ${(discretionaryShare * 100).toFixed(0)}% (₹${Math.round(discretionarySpending).toLocaleString('en-IN')}) of total household income.`,
      impact: "Variable expenses are crowding out both emergency buffer growth and debt amortization.",
      recommendation: "Introduce a soft monthly ceiling on entertainment and lifestyle categories until debt burden normalizes."
    });

    traits.push({
      trait: "Impulse Spender",
      category: "SECONDARY",
      description: "Shows higher variability and elevated elasticity in discretionary categories when free cash is available.",
      evidence: `Discretionary outflows represent ${(discretionaryShare * 100).toFixed(0)}% of earnings.`,
      recommendedInterventionStyle: "Contextual checkout reminders and category-specific debit alerts.",
      badgeColor: "#f97316"
    });
  }

  // 4. Subscription Accumulation
  if (recurringSubscriptions > 1500) {
    signals.push({
      pattern: "SUBSCRIPTION_ACCUMULATION",
      title: "Subscription Accumulation",
      severity: recurringSubscriptions > 3000 ? "HIGH" : "MEDIUM",
      evidence: `Recurring digital services and memberships total ₹${Math.round(recurringSubscriptions).toLocaleString('en-IN')}/month across active statements.`,
      impact: "Fixed recurring charges create silent baseline friction that reduces month-end savings momentum.",
      recommendation: "Audit active recurring subscriptions and discontinue services unutilized over the past 30 days."
    });

    traits.push({
      trait: "Subscription Heavy",
      category: "SUPPORTING",
      description: "Maintains a noticeable cluster of automated monthly recurring commitments.",
      evidence: `₹${Math.round(recurringSubscriptions).toLocaleString('en-IN')}/month in recurring digital debits.`,
      recommendedInterventionStyle: "Quarterly recurring subscription audit and single-click cancellation summaries.",
      badgeColor: "#8b5cf6"
    });
  }

  // 5. Credit Dependency
  const creditRatio = monthlyIncome > 0 ? (creditCardUsage + debtObligations) / monthlyIncome : 0;
  if (creditRatio > 0.35 || creditCardUsage > 15000) {
    signals.push({
      pattern: "CREDIT_DEPENDENCY",
      title: "Elevated Credit Reliance",
      severity: creditRatio > 0.50 ? "CRITICAL" : "HIGH",
      evidence: `Credit-backed payments and revolving obligations represent ${(creditRatio * 100).toFixed(0)}% of regular monthly inflows.`,
      impact: "Reliance on high-cost revolving debt compounds borrowing interest and elevates financial distress probability.",
      recommendation: "Transition variable grocery and discretionary purchases to debit or UPI while formulating a debt paydown strategy."
    });

    traits.push({
      trait: "Credit Dependent",
      category: "SECONDARY",
      description: "Frequently utilizes short-term revolving or credit instruments for routine operational needs.",
      evidence: `Credit utilization metric represents ${(creditRatio * 100).toFixed(0)}% of monthly operational cashflow.`,
      recommendedInterventionStyle: "Structured consolidation pathways and debit-based budgeting guardrails.",
      badgeColor: "#ef4444"
    });
  }

  // Positive Traits
  if (savingsRate >= 0.20) {
    traits.push({
      trait: "Steady Saver",
      category: "PRIMARY",
      description: "Consistently retains 20%+ of monthly compensation across successive billing periods.",
      evidence: `Current savings rate is ${(savingsRate * 100).toFixed(1)}%.`,
      recommendedInterventionStyle: "Autonomous yield optimization and disciplined goal-based investing.",
      badgeColor: "#10b981"
    });
  }

  if (emergencyBuffer >= (monthlyExpenses + debtObligations) * 3) {
    traits.push({
      trait: "Emergency-Prepared",
      category: "SUPPORTING",
      description: "Holds sufficient liquid reserves to withstand 3+ months of comprehensive burn.",
      evidence: `Emergency buffer equals ${(emergencyBuffer / (monthlyExpenses + debtObligations)).toFixed(1)} months of burn.`,
      recommendedInterventionStyle: "Capital preservation with liquid emergency deposit structuring.",
      badgeColor: "#06b6d4"
    });
  }

  if (debtObligations === 0 || (monthlyIncome > 0 && debtObligations / monthlyIncome < 0.15)) {
    traits.push({
      trait: "Debt-Conservative",
      category: "SUPPORTING",
      description: "Maintains minimal to zero exposure to long-term leverage obligations.",
      evidence: `Monthly debt obligations represent only ${(debtObligations / Math.max(monthlyIncome, 1) * 100).toFixed(0)}% of income.`,
      recommendedInterventionStyle: "Focus on capital preservation and tax-efficient asset accumulation.",
      badgeColor: "#3b82f6"
    });
  }

  // Default fallback traits if none detected
  if (traits.length === 0) {
    traits.push({
      trait: "Irregular Spender",
      category: "PRIMARY",
      description: "Demonstrates fluctuating spending behavior across discrete categories without fixed rhythm.",
      evidence: "Spending variation between billing cycles requires additional stabilization.",
      recommendedInterventionStyle: "Weekly dynamic budget envelope allocations.",
      badgeColor: "#6b7280"
    });
  }

  const primaryDna = traits[0];
  const secondaryDna = traits.length > 1 ? traits[1] : traits[0];

  return {
    signals,
    primaryDna,
    secondaryDna,
    traits,
  };
}
