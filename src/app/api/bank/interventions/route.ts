import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InterventionCreateSchema } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const interventions = await prisma.intervention.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        analyst: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ interventions });
  } catch (err) {
    console.error("Interventions GET error:", err);
    return NextResponse.json({ error: "Failed to fetch interventions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let analystId = (session?.user as any)?.id;

    if (!analystId) {
      const defaultAnalyst = await prisma.user.findFirst({
        where: { email: "analyst@bank.com" },
      });
      if (defaultAnalyst) analystId = defaultAnalyst.id;
    }

    if (!analystId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = InterventionCreateSchema.parse(body);

    // Retrieve customer's current health score for baseline tracking
    const customer = await prisma.user.findUnique({
      where: { id: validated.customerId },
      include: { snapshots: { orderBy: { date: "desc" }, take: 1 } },
    });

    const currentHealth = customer?.snapshots[0]?.healthScore ?? 50;

    const intervention = await prisma.intervention.create({
      data: {
        analystId,
        customerId: validated.customerId,
        type: validated.type,
        status: validated.status,
        reason: validated.reason,
        customerResponse: validated.customerResponse,
        outcomeNotes: validated.outcomeNotes,
        healthBefore: currentHealth,
      },
    });

    return NextResponse.json({
      intervention,
      message: "Proactive intervention logged successfully",
    }, { status: 201 });
  } catch (err: any) {
    console.error("Interventions POST error:", err);
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create intervention" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, customerResponse, outcomeNotes, healthAfter } = body;

    if (!id) {
      return NextResponse.json({ error: "Intervention ID is required" }, { status: 400 });
    }

    const updated = await prisma.intervention.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(customerResponse && { customerResponse }),
        ...(outcomeNotes && { outcomeNotes }),
        ...(healthAfter !== undefined && { healthAfter }),
      },
    });

    return NextResponse.json({ intervention: updated, message: "Intervention updated successfully" });
  } catch (err) {
    console.error("Interventions PATCH error:", err);
    return NextResponse.json({ error: "Failed to update intervention" }, { status: 500 });
  }
}
