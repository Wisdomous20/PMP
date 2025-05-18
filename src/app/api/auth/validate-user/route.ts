import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, token } = await req.json();
  if (!userId || !token) {
    return NextResponse.json(
      { error: "Missing userId or token" },
      { status: 400 }
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (
    !record ||
    record.userId !== userId ||
    record.expires <= new Date()
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" }
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({
    success: true,
    message: "Email verified successfully!",
  });
}