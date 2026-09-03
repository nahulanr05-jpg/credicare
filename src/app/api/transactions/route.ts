import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TransactionCreateSchema } from "@/lib/types";

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

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // all | today | week | month

    let dateFilter: any = {};
    const now = new Date();

    if (filter === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { gte: startOfDay };
    } else if (filter === "week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = { gte: startOfWeek };
    } else if (filter === "month") {
      const startOfMonth = new Date(now.setMonth(now.getMonth() - 1));
      dateFilter = { gte: startOfMonth };
    }

    const whereClause: any = { userId };
    if (Object.keys(dateFilter).length > 0) {
      whereClause.date = dateFilter;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    // Compute automatic aggregations
    let totalIncome = 0;
    let totalExpenses = 0;
    let debtPayments = 0;
    let discretionarySpending = 0;
    let essentialSpending = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === "INCOME") {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        if (tx.categoryName === "EMI") {
          debtPayments += tx.amount;
        }
        if (tx.isEssential) {
          essentialSpending += tx.amount;
        } else {
          discretionarySpending += tx.amount;
        }

        categoryTotals[tx.categoryName] = (categoryTotals[tx.categoryName] || 0) + tx.amount;
      }
    });

    // Provide default fallback income if transactions represent only partial month
    if (totalIncome === 0) totalIncome = 50000;
    const totalSavings = Math.max(0, totalIncome - totalExpenses);
    const savingsRate = totalIncome > 0 ? totalSavings / totalIncome : 0;

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
    }));

    return NextResponse.json({
      transactions,
      summary: {
        totalIncome,
        totalExpenses,
        totalSavings,
        savingsRate,
        debtPayments,
        discretionarySpending,
        essentialSpending,
      },
      categoryBreakdown,
    });
  } catch (err) {
    console.error("Transactions GET error:", err);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

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
    const validated = TransactionCreateSchema.parse(body);

    const isEssentialCategories = ["Housing", "Utilities", "Healthcare", "Food", "EMI", "Insurance", "Education"];
    const isEssential = validated.isEssential || isEssentialCategories.includes(validated.categoryName);

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: validated.amount,
        type: validated.type,
        categoryName: validated.categoryName,
        description: validated.description,
        paymentMethod: validated.paymentMethod,
        isRecurring: validated.isRecurring,
        isEssential,
        date: validated.date ? new Date(validated.date) : new Date(),
      },
    });

    return NextResponse.json({ transaction, message: "Transaction recorded successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("Transactions POST error:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
