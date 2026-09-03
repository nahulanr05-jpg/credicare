import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase().trim(),
        name: validated.name,
        passwordHash,
        role: validated.role,
        profile: {
          create: {
            monthlyIncome: 50000,
            targetSavings: 10000,
            emergencyTarget: 50000,
          },
        },
        snapshots: {
          create: {
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
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully.", user },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Register Error:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
