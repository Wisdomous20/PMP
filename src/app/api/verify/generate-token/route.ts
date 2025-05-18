import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const VERIFICATION_WINDOW_MINUTES = Number(
  process.env.VERIFICATION_WINDOW_MINUTES || 10
);

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const token = randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_WINDOW_MINUTES * 60000);

  await prisma.verificationToken.deleteMany({ where: { userId } });

  await prisma.verificationToken.create({
    data: { userId, token, expires },
  });

  return NextResponse.json({ token });
}
