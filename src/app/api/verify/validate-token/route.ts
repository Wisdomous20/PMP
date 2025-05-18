import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, token } = await req.json();
  if (!userId || !token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  const valid =
    !!record &&
    record.userId === userId &&
    record.expires > new Date();

  if (valid) {
    await prisma.verificationToken.delete({ where: { token } });
  }

  return NextResponse.json({ valid });
}