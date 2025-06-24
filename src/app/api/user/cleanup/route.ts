// app/api/cleanup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { tokenStore } from "@/lib/tokenVerification";

const prisma = new PrismaClient();

function purgeExpiredTokens() {
  const now = new Date();
  tokenStore.forEach(({ expires }, attendeeId) => {
    if (expires < now) {
      tokenStore.delete(attendeeId);
    }
  });
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 15 * 60 * 1000);
  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        isVerified: false,
        createdAt: { lt: cutoff },
      },
    });
    await purgeExpiredTokens();

    return NextResponse.json(
      {
        message: `Deleted ${deleted.count} unverified users older than 15 min, purged expired tokens.`,
        deletedCount: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[cleanup API] error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
