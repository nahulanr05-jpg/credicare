import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "BANK_ANALYST", "ADMIN"]).default("CUSTOMER"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const TransactionCreateSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryName: z.enum([
    "Food",
    "Transport",
    "Housing",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Subscriptions",
    "Healthcare",
    "Education",
    "EMI",
    "Insurance",
    "Other",
  ]),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
  paymentMethod: z.enum(["UPI", "DEBIT_CARD", "CREDIT_CARD", "NET_BANKING", "CASH"]).default("UPI"),
  isRecurring: z.boolean().default(false),
  isEssential: z.boolean().default(false),
});

export const LoanReadinessInputSchema = z.object({
  desiredAmount: z.number().positive("Desired loan amount must be positive"),
  tenureMonths: z.number().int().min(6).max(360),
  interestRate: z.number().min(1).max(50),
  loanType: z.enum(["PERSONAL", "HOME", "AUTO", "EDUCATION"]).default("PERSONAL"),
});

export const SimulationInputSchema = z.object({
  type: z.enum(["TIME_MACHINE", "CRASH"]),
  scenarioName: z.string(),
  parameters: z.record(z.any()),
});

export const CrashScenarioSchema = z.object({
  scenarioId: z.enum([
    "SALARY_DROP_10",
    "SALARY_DROP_20",
    "LOSE_PRIMARY_INCOME",
    "EMERGENCY_25K",
    "EMERGENCY_50K",
    "EMERGENCY_100K",
    "RENT_INCREASE_5K",
    "NEW_EMI_8K",
    "CREDIT_CARD_DEBT_30K",
    "CUSTOM",
  ]),
  customIncomeChangePercent: z.number().optional(),
  customExpenseAmount: z.number().optional(),
  customMonthlyEmi: z.number().optional(),
});

export const InterventionCreateSchema = z.object({
  customerId: z.string().uuid(),
  type: z.enum([
    "FINANCIAL_COUNSELLING",
    "PROACTIVE_CONTACT",
    "REPAYMENT_ASSISTANCE",
    "BUDGETING_SUPPORT",
    "RESTRUCTURING_REVIEW",
  ]),
  reason: z.string().min(5, "Reason is required"),
  status: z.enum([
    "RECOMMENDED",
    "CONTACTED",
    "ACCEPTED",
    "DECLINED",
    "RESOLVED",
    "MONITORING",
  ]).default("RECOMMENDED"),
  customerResponse: z.string().optional(),
  outcomeNotes: z.string().optional(),
});

export const ChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().optional(),
});
