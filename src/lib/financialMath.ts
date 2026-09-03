/**
 * Deterministic Financial Calculation Engine for Financial Firewall
 * Strict compliance with Responsible Finance rules:
 * - Transparent scoring
 * - Non-guaranteed probabilistic projections
 * - Clear contributing factors and explainability
 */

export interface FinancialProfileMetrics {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number; // 0 to 1
  debtObligations: number; // monthly EMI / debt servicing
  totalDebt: number;
  emergencyBuffer: number;
  discretionarySpending: number;
  essentialSpending: number;
  recurringSubscriptions: number;
  creditCardUsage: number;
}

export interface HealthScoreResult {
  score: number; // 0 - 100
  classification: "HEALTHY" | "STABLE_WATCH" | "EARLY_WARNING" | "FINANCIAL_STRESS" | "CRITICAL";
  label: string;
  color: string;
  trend: "IMPROVING" | "STABLE" | "DECLINING";
  factors: {
    incomeStability: { score: number; weight: number; contribution: number; explanation: string };
    savingsHealth: { score: number; weight: number; contribution: number; explanation: string };
    debtBurden: { score: number; weight: number; contribution: number; explanation: string };
    spendingBehavior: { score: number; weight: number; contribution: number; explanation: string };
    emergencyBuffer: { score: number; weight: number; contribution: number; explanation: string };
    repaymentConsistency: { score: number; weight: number; contribution: number; explanation: string };
  };
  primaryRecommendation: string;
  recommendedActions: string[];
}

export function calculateHealthScore(
  metrics: FinancialProfileMetrics,
  repaymentHistoryRate: number = 1.0 // 0.0 to 1.0 (on-time payments)
): HealthScoreResult {
  const {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    debtObligations,
    emergencyBuffer,
    discretionarySpending,
  } = metrics;

  // 1. Income Stability (25%): baseline adequacy and buffer against baseline needs
  // Essential expense coverage ratio
  const essentialExpenses = metrics.essentialSpending || (monthlyExpenses * 0.6);
  const incomeToEssentialRatio = monthlyIncome > 0 ? (monthlyIncome / Math.max(essentialExpenses, 1)) : 0;
  let incomeStabilityScore = Math.min(100, Math.max(10, (incomeToEssentialRatio / 2.0) * 100));

  // 2. Savings Health (20%): savings rate benchmark (ideal >= 20%)
  let savingsHealthScore = Math.min(100, Math.max(0, (savingsRate / 0.20) * 100));

  // 3. Debt Burden (20%): DTI (debt-to-income ratio). Lower is better. Safe <= 25%, High >= 45%
  const dti = monthlyIncome > 0 ? (debtObligations / monthlyIncome) : 1;
  let debtBurdenScore = 100;
  if (dti <= 0.15) debtBurdenScore = 100;
  else if (dti <= 0.30) debtBurdenScore = 85 - ((dti - 0.15) / 0.15) * 25;
  else if (dti <= 0.50) debtBurdenScore = 60 - ((dti - 0.30) / 0.20) * 35;
  else debtBurdenScore = Math.max(5, 25 - ((dti - 0.50) / 0.30) * 20);

  // 4. Spending Behavior (15%): Discretionary share of income. Safe <= 25%, Warning >= 40%
  const discretionaryRatio = monthlyIncome > 0 ? (discretionarySpending / monthlyIncome) : 0.5;
  let spendingBehaviorScore = 100;
  if (discretionaryRatio <= 0.20) spendingBehaviorScore = 95;
  else if (discretionaryRatio <= 0.35) spendingBehaviorScore = 80 - ((discretionaryRatio - 0.20) / 0.15) * 30;
  else spendingBehaviorScore = Math.max(10, 50 - ((discretionaryRatio - 0.35) / 0.25) * 40);

  // 5. Emergency Buffer (10%): Months of essential expenses covered (ideal 3 - 6 months)
  const monthlyBurn = monthlyExpenses + debtObligations;
  const bufferMonths = monthlyBurn > 0 ? (emergencyBuffer / monthlyBurn) : 0;
  let emergencyBufferScore = Math.min(100, Math.max(0, (bufferMonths / 3.0) * 100));

  // 6. Repayment Consistency (10%)
  let repaymentConsistencyScore = Math.min(100, Math.max(10, repaymentHistoryRate * 100));

  // Weighted Total
  const totalScore = Math.round(
    incomeStabilityScore * 0.25 +
    savingsHealthScore * 0.20 +
    debtBurdenScore * 0.20 +
    spendingBehaviorScore * 0.15 +
    emergencyBufferScore * 0.10 +
    repaymentConsistencyScore * 0.10
  );

  const boundedScore = Math.min(100, Math.max(0, totalScore));

  let classification: HealthScoreResult["classification"];
  let label: string;
  let color: string;
  let primaryRecommendation: string;

  if (boundedScore >= 80) {
    classification = "HEALTHY";
    label = "Healthy";
    color = "#10b981"; // emerald-500
    primaryRecommendation = "Maintain your current disciplined allocation; consider optimizing returns on idle buffers.";
  } else if (boundedScore >= 65) {
    classification = "STABLE_WATCH";
    label = "Stable / Watch";
    color = "#06b6d4"; // cyan-500
    primaryRecommendation = "Reinforce your emergency buffer and monitor discretionary expenditure spikes.";
  } else if (boundedScore >= 50) {
    classification = "EARLY_WARNING";
    label = "Early Warning";
    color = "#f59e0b"; // amber-500
    primaryRecommendation = "Immediate adjustment recommended: cap discretionary spending and avoid taking on new debt obligations.";
  } else if (boundedScore >= 30) {
    classification = "FINANCIAL_STRESS";
    label = "Financial Stress";
    color = "#f97316"; // orange-500
    primaryRecommendation = "Active financial intervention advised: restructure high-cost liabilities and preserve minimum liquidity.";
  } else {
    classification = "CRITICAL";
    label = "Critical";
    color = "#ef4444"; // red-500
    primaryRecommendation = "Urgent debt intervention required. Contact loan advisors for structured relief and pause non-vital outflow.";
  }

  const actions: string[] = [];
  if (emergencyBufferScore < 60) actions.push("Prioritize allocating at least ₹1,500/month towards your emergency buffer.");
  if (discretionaryRatio > 0.30) actions.push("Reduce non-essential entertainment and dining subscriptions by 15%.");
  if (dti > 0.35) actions.push("Prioritize prepayment or restructuring of high-interest unsecured liabilities.");
  if (savingsRate < 0.15) actions.push("Automate your target savings transfer on the first day following salary credit.");

  return {
    score: boundedScore,
    classification,
    label,
    color,
    trend: boundedScore > 70 ? "IMPROVING" : boundedScore > 50 ? "STABLE" : "DECLINING",
    factors: {
      incomeStability: {
        score: Math.round(incomeStabilityScore),
        weight: 25,
        contribution: Math.round(incomeStabilityScore * 0.25),
        explanation: `Income covers essential burn with a ${(incomeToEssentialRatio).toFixed(1)}x safety factor.`
      },
      savingsHealth: {
        score: Math.round(savingsHealthScore),
        weight: 20,
        contribution: Math.round(savingsHealthScore * 0.20),
        explanation: `Current savings rate is ${(savingsRate * 100).toFixed(1)}% (Benchmark: 20%).`
      },
      debtBurden: {
        score: Math.round(debtBurdenScore),
        weight: 20,
        contribution: Math.round(debtBurdenScore * 0.20),
        explanation: `Debt servicing represents ${(dti * 100).toFixed(1)}% of net monthly income.`
      },
      spendingBehavior: {
        score: Math.round(spendingBehaviorScore),
        weight: 15,
        contribution: Math.round(spendingBehaviorScore * 0.15),
        explanation: `Discretionary expenses account for ${(discretionaryRatio * 100).toFixed(1)}% of earnings.`
      },
      emergencyBuffer: {
        score: Math.round(emergencyBufferScore),
        weight: 10,
        contribution: Math.round(emergencyBufferScore * 0.10),
        explanation: `Buffer currently provides ${bufferMonths.toFixed(1)} months of runway.`
      },
      repaymentConsistency: {
        score: Math.round(repaymentConsistencyScore),
        weight: 10,
        contribution: Math.round(repaymentConsistencyScore * 0.10),
        explanation: `On-time repayment metric stands at ${(repaymentHistoryRate * 100).toFixed(0)}%.`
      }
    },
    primaryRecommendation,
    recommendedActions: actions.slice(0, 3),
  };
}

/**
 * Calculate Monthly Loan EMI (Standard Reducing Balance formula)
 */
export function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (annualRate <= 0 || tenureMonths <= 0) return principal / Math.max(tenureMonths, 1);
  const monthlyRate = (annualRate / 12) / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

/**
 * Loan Readiness Assessment (Non-promissory, responsible finance analysis)
 */
export interface LoanReadinessResult {
  status: "READY" | "CAUTION" | "NOT_CURRENTLY_READY";
  badgeColor: string;
  headline: string;
  estimatedEMI: number;
  totalNewDti: number;
  currentDti: number;
  availableCashFlow: number;
  remainingCashAfterEMI: number;
  reasons: string[];
  preventativeAdvice: string;
  roadmap?: {
    month: number;
    title: string;
    action: string;
    targetMetric: string;
  }[];
}

export function assessLoanReadiness(
  metrics: FinancialProfileMetrics,
  loanAmount: number,
  tenureMonths: number,
  interestRate: number
): LoanReadinessResult {
  const estimatedEMI = calculateEMI(loanAmount, interestRate, tenureMonths);
  const currentDti = metrics.monthlyIncome > 0 ? (metrics.debtObligations / metrics.monthlyIncome) : 1;
  const totalNewDebt = metrics.debtObligations + estimatedEMI;
  const totalNewDti = metrics.monthlyIncome > 0 ? (totalNewDebt / metrics.monthlyIncome) : 1;
  const availableCashFlow = metrics.monthlyIncome - metrics.monthlyExpenses - metrics.debtObligations;
  const remainingCashAfterEMI = availableCashFlow - estimatedEMI;
  const bufferMonths = (metrics.monthlyExpenses + metrics.debtObligations) > 0
    ? metrics.emergencyBuffer / (metrics.monthlyExpenses + metrics.debtObligations)
    : 0;

  const reasons: string[] = [];

  if (totalNewDti > 0.45) {
    reasons.push(`Projected Debt-to-Income (DTI) reaches ${(totalNewDti * 100).toFixed(1)}%, exceeding the recommended 40% prudential threshold.`);
  }
  if (remainingCashAfterEMI < 2500) {
    reasons.push(`Remaining post-obligation liquidity would drop to ₹${Math.max(0, Math.round(remainingCashAfterEMI)).toLocaleString('en-IN')}, leaving insufficient margin for unforeseen expenses.`);
  }
  if (bufferMonths < 1.5) {
    reasons.push(`Emergency buffer provides only ${bufferMonths.toFixed(1)} months of coverage against combined outflows.`);
  }
  if (metrics.discretionarySpending / Math.max(metrics.monthlyIncome, 1) > 0.35) {
    reasons.push(`Discretionary spending represents ${(metrics.discretionarySpending / metrics.monthlyIncome * 100).toFixed(0)}% of income, creating repayment vulnerability.`);
  }

  let status: LoanReadinessResult["status"] = "READY";
  let badgeColor = "#10b981";
  let headline = "Financial readiness indicators are favorable for this borrowing scale.";
  let preventativeAdvice = "Ensure you maintain automatic payments and avoid depleting your core emergency reserves.";

  if (reasons.length >= 2 || totalNewDti > 0.50 || remainingCashAfterEMI < 0) {
    status = "NOT_CURRENTLY_READY";
    badgeColor = "#ef4444";
    headline = "Based on the information provided, your current financial profile appears less suitable for taking on this additional repayment obligation.";
    preventativeAdvice = "Taking on this obligation without expense consolidation could trigger significant liquidity distress within 60-90 days.";
  } else if (reasons.length === 1 || totalNewDti > 0.38) {
    status = "CAUTION";
    badgeColor = "#f59e0b";
    headline = "Moderate risk signals detected. Additional debt capacity is tight.";
    preventativeAdvice = "Consider a smaller loan amount, longer tenure, or rationalizing current discretionary outlays prior to committing.";
  }

  // 5-Month Adaptive Reverse Loan Roadmap for NOT_CURRENTLY_READY or CAUTION
  const roadmap = [
    {
      month: 1,
      title: "Reduce Discretionary Expenses",
      action: `Cap non-essential spending at ₹${Math.round(metrics.discretionarySpending * 0.75).toLocaleString('en-IN')}/month to liberate ₹${Math.round(metrics.discretionarySpending * 0.25).toLocaleString('en-IN')} in free cashflow.`,
      targetMetric: "Discretionary ratio < 25%"
    },
    {
      month: 2,
      title: "Build Emergency Reserve",
      action: `Channel recovered cashflow to expand the liquid emergency buffer towards ₹${Math.round(Math.max(metrics.emergencyBuffer * 1.3, 40000)).toLocaleString('en-IN')}.`,
      targetMetric: "Buffer > 2.5 months expenses"
    },
    {
      month: 3,
      title: "Accelerate High-Cost Debt Paydown",
      action: "Prepay smallest revolving debt balances or high-interest cards to lower fixed monthly obligations.",
      targetMetric: `Existing DTI target: < ${(Math.max(0.15, currentDti * 0.8) * 100).toFixed(0)}%`
    },
    {
      month: 4,
      title: "Demonstrate Repayment Consistency",
      action: "Maintain 100% on-time obligations while preserving the newly established monthly savings trajectory.",
      targetMetric: "Savings Rate >= 15%"
    },
    {
      month: 5,
      title: "Reassess Loan Readiness",
      action: "Rerun the Financial Firewall assessment with reduced liabilities and elevated buffer metrics.",
      targetMetric: "Readiness State -> READY"
    }
  ];

  return {
    status,
    badgeColor,
    headline,
    estimatedEMI,
    totalNewDti,
    currentDti,
    availableCashFlow,
    remainingCashAfterEMI,
    reasons,
    preventativeAdvice,
    roadmap: status !== "READY" ? roadmap : undefined,
  };
}

/**
 * Financial Time Machine Simulation (Today -> 180 Days)
 */
export interface TimeMachineSnapshot {
  period: "TODAY" | "30_DAYS" | "60_DAYS" | "90_DAYS" | "180_DAYS";
  dayLabel: string;
  healthScore: number;
  projectedSavings: number;
  projectedDebt: number;
  projectedBuffer: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  narrative: string;
}

export function generateTimeMachineProjection(metrics: FinancialProfileMetrics): {
  timeline: TimeMachineSnapshot[];
  summaryNarrative: string;
} {
  const currentHealth = calculateHealthScore(metrics).score;
  const netMonthlyCashflow = metrics.monthlyIncome - metrics.monthlyExpenses - metrics.debtObligations;

  // Modeling trajectory based on whether cashflow is positive or negative, and discretionary trends
  const isDeteriorating = netMonthlyCashflow <= 0 || (metrics.discretionarySpending / Math.max(metrics.monthlyIncome, 1)) > 0.35;

  const periods: Array<{ period: TimeMachineSnapshot["period"]; dayLabel: string; days: number }> = [
    { period: "TODAY", dayLabel: "Today", days: 0 },
    { period: "30_DAYS", dayLabel: "30 Days", days: 30 },
    { period: "60_DAYS", dayLabel: "60 Days", days: 60 },
    { period: "90_DAYS", dayLabel: "90 Days", days: 90 },
    { period: "180_DAYS", dayLabel: "180 Days", days: 180 },
  ];

  const timeline: TimeMachineSnapshot[] = periods.map((p) => {
    const months = p.days / 30;
    let score = currentHealth;
    let buffer = metrics.emergencyBuffer;
    let savings = metrics.monthlySavings * (months + 1);
    let debt = Math.max(0, metrics.totalDebt - (metrics.debtObligations * 0.7 * months));

    if (isDeteriorating) {
      // Degrading scenario: erosion of buffer, health drops
      const degradation = months * 4.5;
      score = Math.max(25, Math.round(currentHealth - degradation));
      buffer = Math.max(5000, metrics.emergencyBuffer - (Math.abs(netMonthlyCashflow) + 1500) * months);
      savings = Math.max(2000, metrics.monthlySavings * Math.max(0.2, 1 - months * 0.2));
    } else {
      // Favorable scenario
      const improvement = months * 1.5;
      score = Math.min(95, Math.round(currentHealth + improvement));
      buffer = metrics.emergencyBuffer + (netMonthlyCashflow * 0.5 * months);
    }

    let riskLevel: TimeMachineSnapshot["riskLevel"] = "LOW";
    if (score < 30) riskLevel = "CRITICAL";
    else if (score < 50) riskLevel = "HIGH";
    else if (score < 65) riskLevel = "MODERATE";

    let narrative = "";
    if (p.period === "TODAY") {
      narrative = `Baseline health of ${score}/100. Emergency buffer sits at ₹${Math.round(buffer).toLocaleString('en-IN')}.`;
    } else if (isDeteriorating) {
      narrative = `If elevated spending continues, buffer will contract by ₹${Math.round(metrics.emergencyBuffer - buffer).toLocaleString('en-IN')}, pulling health down to ${score}.`;
    } else {
      narrative = `Prudent debt paydown strengthens buffer to ₹${Math.round(buffer).toLocaleString('en-IN')} with health stabilizing at ${score}.`;
    }

    return {
      period: p.period,
      dayLabel: p.dayLabel,
      healthScore: score,
      projectedSavings: Math.round(savings),
      projectedDebt: Math.round(debt),
      projectedBuffer: Math.round(buffer),
      riskLevel,
      narrative,
    };
  });

  const summaryNarrative = isDeteriorating
    ? "If your current financial behavior continues, your financial buffer may become significantly weaker over the next few months."
    : "Your current financial allocation displays positive resilience, supporting steady buffer growth and progressive liability reduction.";

  return { timeline, summaryNarrative };
}

/**
 * Financial Crash Simulator Engine
 */
export interface CrashSimulationResult {
  scenarioTitle: string;
  description: string;
  originalHealth: number;
  simulatedHealth: number;
  healthDelta: number;
  originalBuffer: number;
  simulatedBuffer: number;
  riskBefore: string;
  riskAfter: string;
  reasonsForChange: string[];
  preventativePlan: {
    title: string;
    withoutInterventionScore: number;
    withInterventionScore: number;
    actions: Array<{ step: number; action: string; impact: string }>;
    disclaimer: string;
  };
}

export function simulateCrashScenario(
  metrics: FinancialProfileMetrics,
  scenarioId: string,
  customParams?: { incomeChangePercent?: number; expenseAmount?: number; monthlyEmi?: number }
): CrashSimulationResult {
  const currentHealth = calculateHealthScore(metrics).score;
  const currentBuffer = metrics.emergencyBuffer;

  let simulatedIncome = metrics.monthlyIncome;
  let simulatedExpenses = metrics.monthlyExpenses;
  let simulatedBuffer = currentBuffer;
  let simulatedDebtObligations = metrics.debtObligations;
  let scenarioTitle = "Custom Scenario";
  let description = "User customized simulation parameters.";

  switch (scenarioId) {
    case "SALARY_DROP_10":
      scenarioTitle = "Salary Decreases by 10%";
      description = "Net monthly income contracted by 10% due to compensation adjustment or incentive cut.";
      simulatedIncome = metrics.monthlyIncome * 0.90;
      break;
    case "SALARY_DROP_20":
      scenarioTitle = "Salary Decreases by 20%";
      description = "20% reduction in base earnings representing market or employer restructuring.";
      simulatedIncome = metrics.monthlyIncome * 0.80;
      break;
    case "LOSE_PRIMARY_INCOME":
      scenarioTitle = "Loss of Primary Income";
      description = "Zero primary salary income for 60 days, testing emergency buffer endurance.";
      simulatedIncome = 0;
      simulatedBuffer = Math.max(0, currentBuffer - (metrics.monthlyExpenses + metrics.debtObligations) * 2);
      break;
    case "EMERGENCY_25K":
      scenarioTitle = "Emergency Expense of ₹25,000";
      description = "Sudden medical or household repair outlay absorbed immediately from liquid reserves.";
      simulatedBuffer = Math.max(0, currentBuffer - 25000);
      break;
    case "EMERGENCY_50K":
      scenarioTitle = "Emergency Expense of ₹50,000";
      description = "High-severity emergency outlay testing liquid resilience.";
      simulatedBuffer = Math.max(0, currentBuffer - 50000);
      break;
    case "EMERGENCY_100K":
      scenarioTitle = "Emergency Expense of ₹1,00,000";
      description = "Severe unexpected capital drain exceeding typical emergency guidelines.";
      simulatedBuffer = Math.max(0, currentBuffer - 100000);
      break;
    case "RENT_INCREASE_5K":
      scenarioTitle = "Housing Rent Increases by ₹5,000/mo";
      description = "Permanent escalation in non-negotiable living expenses.";
      simulatedExpenses = metrics.monthlyExpenses + 5000;
      break;
    case "NEW_EMI_8K":
      scenarioTitle = "New Equipment/Vehicle EMI of ₹8,000/mo";
      description = "Addition of new fixed repayment obligation.";
      simulatedDebtObligations = metrics.debtObligations + 8000;
      break;
    case "CREDIT_CARD_DEBT_30K":
      scenarioTitle = "Credit Card Revolving Balance of ₹30,000";
      description = "Revolving short-term debt incurring high interest burden (~36% APR).";
      simulatedDebtObligations = metrics.debtObligations + 3500;
      break;
    case "CUSTOM":
      scenarioTitle = "Custom What-If Scenario";
      if (customParams?.incomeChangePercent) {
        simulatedIncome = metrics.monthlyIncome * (1 + customParams.incomeChangePercent / 100);
      }
      if (customParams?.expenseAmount) {
        simulatedBuffer = Math.max(0, currentBuffer - customParams.expenseAmount);
      }
      if (customParams?.monthlyEmi) {
        simulatedDebtObligations = metrics.debtObligations + customParams.monthlyEmi;
      }
      description = "Custom modeled variance across income, buffer, and liability obligations.";
      break;
  }

  const simulatedSavings = Math.max(0, simulatedIncome - simulatedExpenses - simulatedDebtObligations);
  const simulatedSavingsRate = simulatedIncome > 0 ? (simulatedSavings / simulatedIncome) : 0;

  const simulatedMetrics: FinancialProfileMetrics = {
    ...metrics,
    monthlyIncome: simulatedIncome,
    monthlyExpenses: simulatedExpenses,
    monthlySavings: simulatedSavings,
    savingsRate: simulatedSavingsRate,
    debtObligations: simulatedDebtObligations,
    emergencyBuffer: simulatedBuffer,
  };

  const simulatedHealthResult = calculateHealthScore(simulatedMetrics);
  const simulatedHealth = simulatedHealthResult.score;

  const reasonsForChange: string[] = [];
  if (simulatedIncome < metrics.monthlyIncome) {
    reasonsForChange.push(`Income contracted by ₹${Math.round(metrics.monthlyIncome - simulatedIncome).toLocaleString('en-IN')}/month, compressing debt servicing margins.`);
  }
  if (simulatedBuffer < currentBuffer) {
    reasonsForChange.push(`Emergency buffer depleted by ₹${Math.round(currentBuffer - simulatedBuffer).toLocaleString('en-IN')}, reducing shock absorption runway.`);
  }
  if (simulatedDebtObligations > metrics.debtObligations) {
    reasonsForChange.push(`Fixed monthly debt obligations rose by ₹${Math.round(simulatedDebtObligations - metrics.debtObligations).toLocaleString('en-IN')}, pushing DTI higher.`);
  }
  if (simulatedSavings < metrics.monthlySavings) {
    reasonsForChange.push(`Monthly net savings capacity fell from ₹${Math.round(metrics.monthlySavings).toLocaleString('en-IN')} to ₹${Math.round(simulatedSavings).toLocaleString('en-IN')}.`);
  }

  const riskBefore = currentHealth >= 65 ? "LOW" : currentHealth >= 50 ? "MODERATE" : "HIGH";
  const riskAfter = simulatedHealth >= 65 ? "LOW" : simulatedHealth >= 50 ? "MODERATE" : simulatedHealth >= 30 ? "HIGH" : "CRITICAL";

  // Prevent this future plan
  const withoutIntervention = Math.max(20, Math.round(simulatedHealth - 7));
  const withIntervention = Math.min(85, Math.round(simulatedHealth + 14));

  return {
    scenarioTitle,
    description,
    originalHealth: currentHealth,
    simulatedHealth,
    healthDelta: simulatedHealth - currentHealth,
    originalBuffer: currentBuffer,
    simulatedBuffer,
    riskBefore,
    riskAfter,
    reasonsForChange,
    preventativePlan: {
      title: "PREVENT THIS FUTURE — Adaptive Shock Mitigation Protocol",
      withoutInterventionScore: withoutIntervention,
      withInterventionScore: withIntervention,
      actions: [
        {
          step: 1,
          action: "Compress discretionary expenditures by ₹2,000–₹3,500/month immediately.",
          impact: "Stops liquidity leakage and stabilizes core savings rate."
        },
        {
          step: 2,
          action: "Ring-fence and preserve remaining liquid emergency reserves.",
          impact: "Prevents reliance on high-cost payday or revolving credit lines."
        },
        {
          step: 3,
          action: "Halt all new non-vital borrowing commitments.",
          impact: "Keeps debt burden from escalating past sustainable thresholds."
        },
        {
          step: 4,
          action: "Maintain strict on-time repayment of existing scheduled EMIs.",
          impact: "Protects institutional credit rating and avoids default penalties."
        },
        {
          step: 5,
          action: "Reassess cashflow metrics after 30 days of adaptive stabilization.",
          impact: "Validates recovery trajectory against modeled expectations."
        }
      ],
      disclaimer: "Model projection for planning purposes. This assessment does not constitute a guaranteed financial outcome or institutional credit approval."
    }
  };
}

/**
 * Debt Recovery Strategies Engine
 */
export interface DebtItem {
  id: string;
  name: string;
  creditor: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number; // e.g., 36 for credit card, 12 for personal loan
  monthlyEMI: number;
}

export interface DebtStrategyResult {
  strategyType: "HIGHEST_COST_FIRST" | "SMALLEST_BALANCE_FIRST" | "BALANCED_RECOVERY";
  name: string;
  description: string;
  tagline: string;
  estimatedMonths: number;
  estimatedInterestSaved: number;
  monthlyRepaymentPressure: "LOW" | "MODERATE" | "HIGH";
  emergencyBufferPreservation: string;
  priorityOrder: string[];
  rationale: string;
}

export function calculateDebtRecoveryStrategies(
  debts: DebtItem[],
  availableMonthlyBuffer: number
): DebtStrategyResult[] {
  if (!debts || debts.length === 0) return [];

  // Strategy A: Avalanche / Highest Cost First
  const highestCostOrder = [...debts]
    .sort((a, b) => b.interestRate - a.interestRate)
    .map(d => `${d.name} (${d.interestRate}% APR)`);

  // Strategy B: Snowball / Smallest Balance First
  const smallestBalanceOrder = [...debts]
    .sort((a, b) => a.remainingAmount - b.remainingAmount)
    .map(d => `${d.name} (₹${d.remainingAmount.toLocaleString('en-IN')})`);

  // Strategy C: Balanced
  const balancedOrder = [...debts]
    .sort((a, b) => (b.interestRate / 100) * b.remainingAmount - (a.interestRate / 100) * a.remainingAmount)
    .map(d => `${d.name}`);

  const totalRemaining = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalMonthlyEMI = debts.reduce((sum, d) => sum + d.monthlyEMI, 0);

  return [
    {
      strategyType: "HIGHEST_COST_FIRST",
      name: "Strategy A — Highest Cost First (Avalanche)",
      tagline: "Mathematically optimal: Minimize lifetime interest outflow.",
      description: "Direct every surplus rupee to the liability with the steepest annual interest percentage while maintaining minimum payments on others.",
      estimatedMonths: Math.max(6, Math.ceil(totalRemaining / (totalMonthlyEMI + Math.max(availableMonthlyBuffer * 0.4, 2000)))),
      estimatedInterestSaved: Math.round(totalRemaining * 0.14),
      monthlyRepaymentPressure: "MODERATE",
      emergencyBufferPreservation: "Retains 70% of current buffer; excess deployed to highest APR debt.",
      priorityOrder: highestCostOrder,
      rationale: "Rapidly curbs compounded interest bleeding, particularly on unsecured credit card balances."
    },
    {
      strategyType: "SMALLEST_BALANCE_FIRST",
      name: "Strategy B — Smallest Balance First (Snowball)",
      tagline: "Behavioral momentum: Quick psychological wins.",
      description: "Eliminate smaller account balances first to quickly remove individual recurring monthly EMI commitments.",
      estimatedMonths: Math.max(7, Math.ceil(totalRemaining / (totalMonthlyEMI + Math.max(availableMonthlyBuffer * 0.35, 1500)))),
      estimatedInterestSaved: Math.round(totalRemaining * 0.09),
      monthlyRepaymentPressure: "LOW",
      emergencyBufferPreservation: "Preserves 80% of emergency buffer while eliminating discrete accounts.",
      priorityOrder: smallestBalanceOrder,
      rationale: "Frees up discrete monthly cashflow commitments quickly, reducing emotional anxiety and cognitive overload."
    },
    {
      strategyType: "BALANCED_RECOVERY",
      name: "Strategy C — Balanced Financial Shield",
      tagline: "Prudential equilibrium: Protect liquidity while de-leveraging.",
      description: "Allocates 50% of free cashflow to emergency buffer growth and 50% to accelerated debt paydown. Prevents relapse.",
      estimatedMonths: Math.max(9, Math.ceil(totalRemaining / (totalMonthlyEMI + Math.max(availableMonthlyBuffer * 0.25, 1000)))),
      estimatedInterestSaved: Math.round(totalRemaining * 0.11),
      monthlyRepaymentPressure: "LOW",
      emergencyBufferPreservation: "Guarantees 100% buffer retention and actively expands liquid safety cushion.",
      priorityOrder: balancedOrder,
      rationale: "Never exhausts emergency savings to clear debt, ensuring sudden expenses do not force emergency borrowing."
    }
  ];
}

/**
 * Financial Resilience Score & Shocks
 */
export interface ResilienceShockTest {
  shockTitle: string;
  scenario: string;
  financialImpact: string;
  recoveryDifficulty: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  survivalRunwayDays: number;
}

export function evaluateResilience(metrics: FinancialProfileMetrics): {
  resilienceScore: number;
  rating: string;
  shocks: ResilienceShockTest[];
} {
  const { monthlyIncome, monthlyExpenses, debtObligations, emergencyBuffer, savingsRate } = metrics;
  const totalBurn = monthlyExpenses + debtObligations;
  const burnDays = totalBurn > 0 ? Math.round((emergencyBuffer / totalBurn) * 30) : 0;

  // Resilience score based on shock absorption
  let score = 50;
  if (burnDays >= 90) score += 30;
  else if (burnDays >= 60) score += 20;
  else if (burnDays >= 30) score += 10;
  else score -= 15;

  if (savingsRate >= 0.20) score += 15;
  else if (savingsRate >= 0.10) score += 5;
  else score -= 10;

  const dti = monthlyIncome > 0 ? (debtObligations / monthlyIncome) : 0.5;
  if (dti <= 0.20) score += 10;
  else if (dti >= 0.40) score -= 15;

  const boundedScore = Math.min(100, Math.max(15, Math.round(score)));

  const shocks: ResilienceShockTest[] = [
    {
      shockTitle: "10% Salary Reduction",
      scenario: "Moderate income contraction for 6 consecutive months.",
      financialImpact: `Reduces monthly savings by ₹${Math.round(monthlyIncome * 0.10).toLocaleString('en-IN')}.`,
      recoveryDifficulty: boundedScore > 65 ? "LOW" : "MODERATE",
      survivalRunwayDays: burnDays > 30 ? burnDays + 45 : 30
    },
    {
      shockTitle: "₹25,000 Immediate Emergency",
      scenario: "Unforeseen medical out-of-pocket or vehicle breakdown.",
      financialImpact: emergencyBuffer >= 25000
        ? `Absorbed by liquid buffer. Buffer drops to ₹${Math.max(0, emergencyBuffer - 25000).toLocaleString('en-IN')}.`
        : "Exceeds current liquid reserves; would necessitate external credit.",
      recoveryDifficulty: emergencyBuffer >= 25000 ? "LOW" : "HIGH",
      survivalRunwayDays: Math.max(5, Math.round(((Math.max(0, emergencyBuffer - 25000)) / Math.max(totalBurn, 1)) * 30))
    },
    {
      shockTitle: "₹50,000 Major Emergency",
      scenario: "Significant unexpected hospitalization or domestic expense.",
      financialImpact: emergencyBuffer >= 50000
        ? `Absorbed with buffer contracting to ₹${Math.max(0, emergencyBuffer - 50000).toLocaleString('en-IN')}.`
        : "Deficit of ₹" + Math.round(50000 - emergencyBuffer).toLocaleString('en-IN') + " requiring debt financing.",
      recoveryDifficulty: emergencyBuffer >= 50000 ? "MODERATE" : "VERY_HIGH",
      survivalRunwayDays: Math.max(2, Math.round(((Math.max(0, emergencyBuffer - 50000)) / Math.max(totalBurn, 1)) * 30))
    },
    {
      shockTitle: "1 Month Income Disruption",
      scenario: "Zero salary credit for 30 days between job transitions.",
      financialImpact: `Requires ₹${Math.round(totalBurn).toLocaleString('en-IN')} draw from reserves.`,
      recoveryDifficulty: emergencyBuffer >= totalBurn ? "LOW" : "HIGH",
      survivalRunwayDays: Math.max(0, burnDays - 30)
    },
    {
      shockTitle: "2 Month Income Disruption",
      scenario: "Prolonged disruption requiring 60 days of total burn absorption.",
      financialImpact: `Total drain of ₹${Math.round(totalBurn * 2).toLocaleString('en-IN')} on household buffer.`,
      recoveryDifficulty: emergencyBuffer >= totalBurn * 2 ? "MODERATE" : "VERY_HIGH",
      survivalRunwayDays: Math.max(0, burnDays - 60)
    }
  ];

  let rating = "Resilient";
  if (boundedScore < 35) rating = "Fragile";
  else if (boundedScore < 55) rating = "Vulnerable";
  else if (boundedScore < 75) rating = "Moderate";

  return {
    resilienceScore: boundedScore,
    rating,
    shocks
  };
}
