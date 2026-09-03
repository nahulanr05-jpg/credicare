import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
    });

    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json({ error: "Transaction not found or access denied" }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Transaction removed successfully" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
