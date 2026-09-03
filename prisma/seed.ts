import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Financial Firewall database...");

  // Clean existing records
  await prisma.notification.deleteMany({});
  await prisma.aIMessage.deleteMany({});
  await prisma.aIConversation.deleteMany({});
  await prisma.intervention.deleteMany({});
  await prisma.recoveryAction.deleteMany({});
  await prisma.recoveryPlan.deleteMany({});
  await prisma.simulation.deleteMany({});
  await prisma.behaviorSignal.deleteMany({});
  await prisma.resilienceScore.deleteMany({});
  await prisma.financialScore.deleteMany({});
  await prisma.financialSnapshot.deleteMany({});
  await prisma.loanScenario.deleteMany({});
  await prisma.debtPayment.deleteMany({});
  await prisma.debt.deleteMany({});
  await prisma.incomeRecord.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash("password123", 10);

  // Categories
  const categories = [
    { name: "Food", type: "EXPENSE", isEssential: true },
    { name: "Housing", type: "EXPENSE", isEssential: true },
    { name: "Utilities", type: "EXPENSE", isEssential: true },
    { name: "Healthcare", type: "EXPENSE", isEssential: true },
    { name: "Transport", type: "EXPENSE", isEssential: false },
    { name: "Shopping", type: "EXPENSE", isEssential: false },
    { name: "Entertainment", type: "EXPENSE", isEssential: false },
    { name: "Subscriptions", type: "EXPENSE", isEssential: false },
    { name: "Education", type: "EXPENSE", isEssential: true },
    { name: "EMI", type: "EXPENSE", isEssential: true },
    { name: "Insurance", type: "EXPENSE", isEssential: true },
    { name: "Salary", type: "INCOME", isEssential: false },
    { name: "Freelance", type: "INCOME", isEssential: false },
    { name: "Other", type: "EXPENSE", isEssential: false },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // 1. BANK ANALYST USER
  const analyst = await prisma.user.create({
    data: {
      email: "analyst@bank.com",
      name: "Priya Sharma (Senior Risk Officer)",
      passwordHash: defaultPassword,
      role: "BANK_ANALYST",
      profile: {
        create: {
          phone: "+91 98765 43210",
          occupation: "Credit Risk Portfolio Lead",
          monthlyIncome: 150000,
        },
      },
    },
  });

  // 2. CUSTOMER 1 — Healthy (~84 Score)
  const userHealthy = await prisma.user.create({
    data: {
      email: "healthy@demo.com",
      name: "Aditya Verma",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      profile: {
        create: {
          phone: "+91 98111 22334",
          occupation: "Senior Systems Architect",
          monthlyIncome: 80000,
          targetSavings: 25000,
          emergencyTarget: 150000,
        },
      },
    },
  });

  // 3. CUSTOMER 2 — Early Warning (~65-68 Score)
  // Target: Income ₹50,000 | Expenses ₹31,500 | Savings ₹8,500 | Debt ₹10,000 | Buffer ₹42,000
  const userEarlyWarning = await prisma.user.create({
    data: {
      email: "earlywarning@demo.com",
      name: "Rohan Kapoor",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      profile: {
        create: {
          phone: "+91 98222 33445",
          occupation: "Digital Product Manager",
          monthlyIncome: 50000,
          targetSavings: 12000,
          emergencyTarget: 60000,
        },
      },
    },
  });

  // 4. CUSTOMER 3 — Financial Stress (~45 Score)
  // Target: Income ₹45,000 | High EMI ₹19,000 | Expenses ₹22,000 | Low savings ₹4,000 | Buffer ₹14,000
  const userStress = await prisma.user.create({
    data: {
      email: "stress@demo.com",
      name: "Neha Sundaram",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      profile: {
        create: {
          phone: "+91 98333 44556",
          occupation: "Operations Executive",
          monthlyIncome: 45000,
          targetSavings: 8000,
          emergencyTarget: 45000,
        },
      },
    },
  });

  // 5. CUSTOMER 4 — Recovery (~59 Score, improving 42 -> 47 -> 53 -> 59)
  const userRecovery = await prisma.user.create({
    data: {
      email: "recovery@demo.com",
      name: "Vikram Malhotra",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      profile: {
        create: {
          phone: "+91 98444 55667",
          occupation: "Independent Contractor",
          monthlyIncome: 55000,
          targetSavings: 15000,
          emergencyTarget: 50000,
        },
      },
    },
  });

  // 6. CUSTOMER 5 — Critical (~27 Score)
  // Target: Income ₹40,000 | High Debt ₹22,000 | Expenses ₹24,000 | Buffer ₹6,000
  const userCritical = await prisma.user.create({
    data: {
      email: "critical@demo.com",
      name: "Siddharth Rao",
      passwordHash: defaultPassword,
      role: "CUSTOMER",
      profile: {
        create: {
          phone: "+91 98555 66778",
          occupation: "Freelance Creative",
          monthlyIncome: 40000,
          targetSavings: 5000,
          emergencyTarget: 40000,
        },
      },
    },
  });

  // Populate data for Customer 2 (Rohan Kapoor - Early Warning)
  // Target: Income ₹50,000, Expenses ₹31,500, Savings ₹8,500, Debt ₹10,000, Buffer ₹42,000
  await prisma.incomeRecord.create({
    data: {
      userId: userEarlyWarning.id,
      amount: 50000,
      source: "Salary (Tech Solutions Ltd)",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isRecurring: true,
    },
  });

  const ewDebt = await prisma.debt.create({
    data: {
      userId: userEarlyWarning.id,
      creditor: "HDFC Bank",
      name: "Personal Appliance Loan",
      totalAmount: 180000,
      remainingAmount: 110000,
      interestRate: 14.5,
      monthlyEMI: 10000,
      tenureMonths: 24,
      status: "ACTIVE",
    },
  });

  await prisma.debtPayment.create({
    data: {
      debtId: ewDebt.id,
      amount: 10000,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Transactions for Rohan (Early warning - 31% spike in week 1, subscriptions, discretionary)
  const now = Date.now();
  const ewTransactions = [
    { desc: "Monthly Salary Credit", amount: 50000, type: "INCOME", cat: "Salary", daysAgo: 5, method: "NET_BANKING", essential: false },
    { desc: "Apartment Rent", amount: 14000, type: "EXPENSE", cat: "Housing", daysAgo: 4, method: "NET_BANKING", essential: true },
    { desc: "Personal Loan EMI", amount: 10000, type: "EXPENSE", cat: "EMI", daysAgo: 3, method: "NET_BANKING", essential: true },
    { desc: "Grocery Supermarket", amount: 4500, type: "EXPENSE", cat: "Food", daysAgo: 3, method: "UPI", essential: true },
    { desc: "Weekend Dining & Lounge", amount: 3200, type: "EXPENSE", cat: "Entertainment", daysAgo: 2, method: "CREDIT_CARD", essential: false },
    { desc: "Online Apparel Sale", amount: 4100, type: "EXPENSE", cat: "Shopping", daysAgo: 2, method: "CREDIT_CARD", essential: false },
    { desc: "Electricity & Gas Utility", amount: 2200, type: "EXPENSE", cat: "Utilities", daysAgo: 1, method: "UPI", essential: true },
    { desc: "Streaming Subscriptions (Netflix, Prime, Spotify)", amount: 1850, type: "EXPENSE", cat: "Subscriptions", daysAgo: 1, method: "CREDIT_CARD", essential: false },
    { desc: "Cab Commutes & Fuel", amount: 1650, type: "EXPENSE", cat: "Transport", daysAgo: 0, method: "UPI", essential: false },
  ];

  for (const t of ewTransactions) {
    await prisma.transaction.create({
      data: {
        userId: userEarlyWarning.id,
        description: t.desc,
        amount: t.amount,
        type: t.type,
        categoryName: t.cat,
        paymentMethod: t.method,
        date: new Date(now - t.daysAgo * 24 * 60 * 60 * 1000),
        isEssential: t.essential,
        isRecurring: t.cat === "Subscriptions" || t.cat === "Housing" || t.cat === "EMI",
      },
    });
  }

  // Behavior signals for Rohan (Early Warning)
  await prisma.behaviorSignal.createMany({
    data: [
      {
        userId: userEarlyWarning.id,
        pattern: "SALARY_CYCLE_SPIKE",
        title: "Salary-Cycle Spending Spike",
        severity: "MEDIUM",
        evidence: "Your spending during the first week after salary is 24% higher than your monthly average.",
        impact: "Your monthly savings target may be missed.",
        recommendation: "Set aside your savings target immediately after salary credit into a locked vault.",
      },
      {
        userId: userEarlyWarning.id,
        pattern: "SAVINGS_DECLINE",
        title: "Savings Rate Compression",
        severity: "MEDIUM",
        evidence: "Your savings rate declined for 3 consecutive months from 24% to 17%.",
        impact: "Diminishes emergency buffer resilience against unexpected life shocks.",
        recommendation: "Automate ₹4,000 monthly sweep before discretionary outlays occur.",
      },
      {
        userId: userEarlyWarning.id,
        pattern: "SUBSCRIPTION_ACCUMULATION",
        title: "Subscription Accumulation",
        severity: "LOW",
        evidence: "Recurring digital subscriptions represent ₹2,340/month.",
        impact: "Creates constant fixed drag on monthly liquid savings.",
        recommendation: "Review active digital subscriptions and cancel underutilized tiers.",
      },
    ],
  });

  // Financial Snapshot for Rohan (Score 68 / 100)
  await prisma.financialSnapshot.create({
    data: {
      userId: userEarlyWarning.id,
      monthlyIncome: 50000,
      monthlyExpenses: 31500,
      monthlySavings: 8500,
      savingsRate: 0.17,
      debtObligations: 10000,
      discretionarySpending: 10800,
      essentialSpending: 20700,
      emergencyBuffer: 42000,
      healthScore: 68,
      healthStatus: "EARLY_WARNING",
      riskLevel: "MODERATE",
    },
  });

  await prisma.financialScore.create({
    data: {
      userId: userEarlyWarning.id,
      type: "HEALTH",
      score: 68,
      incomeStabilityScore: 75,
      savingsHealthScore: 65,
      debtBurdenScore: 65,
      spendingBehaviorScore: 58,
      emergencyBufferScore: 62,
      repaymentScore: 90,
    },
  });

  await prisma.resilienceScore.create({
    data: {
      userId: userEarlyWarning.id,
      score: 64,
      shockAbsorptionDays: 45,
      stressResistance: "MODERATE",
    },
  });

  // Seed snapshots for Customer 1 (Healthy - 84)
  await prisma.financialSnapshot.create({
    data: {
      userId: userHealthy.id,
      monthlyIncome: 80000,
      monthlyExpenses: 38000,
      monthlySavings: 26000,
      savingsRate: 0.325,
      debtObligations: 6000,
      discretionarySpending: 9000,
      essentialSpending: 29000,
      emergencyBuffer: 150000,
      healthScore: 84,
      healthStatus: "HEALTHY",
      riskLevel: "LOW",
    },
  });

  await prisma.financialScore.create({
    data: {
      userId: userHealthy.id,
      type: "HEALTH",
      score: 84,
      incomeStabilityScore: 90,
      savingsHealthScore: 92,
      debtBurdenScore: 88,
      spendingBehaviorScore: 82,
      emergencyBufferScore: 85,
      repaymentScore: 95,
    },
  });

  // Seed snapshots for Customer 3 (Stress - 45)
  await prisma.financialSnapshot.create({
    data: {
      userId: userStress.id,
      monthlyIncome: 45000,
      monthlyExpenses: 22000,
      monthlySavings: 4000,
      savingsRate: 0.088,
      debtObligations: 19000,
      discretionarySpending: 7500,
      essentialSpending: 14500,
      emergencyBuffer: 14000,
      healthScore: 45,
      healthStatus: "FINANCIAL_STRESS",
      riskLevel: "HIGH",
    },
  });

  await prisma.financialScore.create({
    data: {
      userId: userStress.id,
      type: "HEALTH",
      score: 45,
      incomeStabilityScore: 55,
      savingsHealthScore: 35,
      debtBurdenScore: 38,
      spendingBehaviorScore: 50,
      emergencyBufferScore: 28,
      repaymentScore: 78,
    },
  });

  // Seed snapshots for Customer 4 (Recovery - 59)
  // Historical trend: 42 -> 47 -> 53 -> 59
  const recoveryScores = [
    { days: 90, score: 42 },
    { days: 60, score: 47 },
    { days: 30, score: 53 },
    { days: 0, score: 59 },
  ];

  for (const item of recoveryScores) {
    await prisma.financialSnapshot.create({
      data: {
        userId: userRecovery.id,
        date: new Date(now - item.days * 24 * 60 * 60 * 1000),
        monthlyIncome: 55000,
        monthlyExpenses: 30000,
        monthlySavings: 13000,
        savingsRate: 0.23,
        debtObligations: 12000,
        discretionarySpending: 6000,
        essentialSpending: 24000,
        emergencyBuffer: 32000,
        healthScore: item.score,
        healthStatus: item.score >= 50 ? "EARLY_WARNING" : "FINANCIAL_STRESS",
        riskLevel: item.score >= 50 ? "MODERATE" : "HIGH",
      },
    });
  }

  await prisma.recoveryPlan.create({
    data: {
      userId: userRecovery.id,
      title: "Active Balance Stabilization Plan",
      description: "Balanced recovery program reducing credit card debt while locking ₹3,000 monthly emergency buffer.",
      strategy: "BALANCED_RECOVERY",
      targetBuffer: 50000,
      targetSavingsRate: 0.25,
      targetDebtReduction: 25000,
      status: "ACTIVE",
      actions: {
        create: [
          { monthNumber: 1, title: "Reduce Discretionary Spending", description: "Cap dining and shopping to save ₹3,000/mo.", isCompleted: true, order: 1 },
          { monthNumber: 2, title: "Emergency Buffer Build", description: "Hold ₹25,000 in liquid emergency deposits.", isCompleted: true, order: 2 },
          { monthNumber: 3, title: "Highest Cost Debt Paydown", description: "Target 36% APR credit card balance with ₹6,000 extra allocation.", isCompleted: true, order: 3 },
          { monthNumber: 4, title: "Maintain Savings Rhythm", description: "Consistent 20%+ savings rate achievement.", isCompleted: false, order: 4 },
          { monthNumber: 5, title: "Reassess Readiness", description: "Verify credit health status before expanding debt capacity.", isCompleted: false, order: 5 },
        ],
      },
    },
  });

  // Seed snapshots for Customer 5 (Critical - 27)
  await prisma.financialSnapshot.create({
    data: {
      userId: userCritical.id,
      monthlyIncome: 40000,
      monthlyExpenses: 24000,
      monthlySavings: 0,
      savingsRate: 0.0,
      debtObligations: 22000,
      discretionarySpending: 9000,
      essentialSpending: 15000,
      emergencyBuffer: 6000,
      healthScore: 27,
      healthStatus: "CRITICAL",
      riskLevel: "CRITICAL",
    },
  });

  await prisma.financialScore.create({
    data: {
      userId: userCritical.id,
      type: "HEALTH",
      score: 27,
      incomeStabilityScore: 30,
      savingsHealthScore: 10,
      debtBurdenScore: 18,
      spendingBehaviorScore: 30,
      emergencyBufferScore: 15,
      repaymentScore: 50,
    },
  });

  // Add Bank Interventions for realistic analyst view
  await prisma.intervention.create({
    data: {
      analystId: analyst.id,
      customerId: userStress.id,
      type: "FINANCIAL_COUNSELLING",
      status: "CONTACTED",
      reason: "DTI elevated at 42.2%, savings rate dropped under 10% for 2 consecutive cycles.",
      customerResponse: "Customer acknowledged cashflow tightness; interested in restructuring high-interest cards.",
      healthBefore: 45,
    },
  });

  await prisma.intervention.create({
    data: {
      analystId: analyst.id,
      customerId: userRecovery.id,
      type: "RESTRUCTURING_REVIEW",
      status: "RESOLVED",
      reason: "Supported customer with consolidated lower-interest repayment schedule.",
      customerResponse: "Accepted 36-month consolidated schedule.",
      outcomeNotes: "Health score improved from 42 to 59 over 90-day review period.",
      healthBefore: 42,
      healthAfter: 59,
    },
  });

  await prisma.intervention.create({
    data: {
      analystId: analyst.id,
      customerId: userCritical.id,
      type: "REPAYMENT_ASSISTANCE",
      status: "RECOMMENDED",
      reason: "Net monthly deficit (-₹6,000/mo) with imminent 60-day default vulnerability.",
      healthBefore: 27,
    },
  });

  // Seed initial notification
  await prisma.notification.createMany({
    data: [
      {
        userId: userEarlyWarning.id,
        type: "WARNING",
        title: "Savings Rate Alert",
        content: "Your savings rate compressed to 17% this month. Tap to view early-warning insights.",
        linkUrl: "/dashboard",
      },
      {
        userId: userEarlyWarning.id,
        type: "ACTION",
        title: "Today's Most Important Action",
        content: "Build your emergency buffer: Set aside ₹1,500 into a liquid reserve.",
        linkUrl: "/dashboard",
      },
      {
        userId: userEarlyWarning.id,
        type: "FUTURE",
        title: "Time Machine Projection",
        content: "Projected 90-day health may decline if discretionary spending continues to elevate.",
        linkUrl: "/future",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
