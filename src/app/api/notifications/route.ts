import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "`userId` is required as a query parameter" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_type: true, department: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let whereClause = {};
    if (user.user_type === "ADMIN" || user.user_type === "SECRETARY") {
      whereClause = {};
    } else if (user.user_type === "SUPERVISOR") {
      whereClause = { department: user.department };
    } else {
      whereClause = { supervisorId: userId };
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, message, link, department, supervisorId } = await req.json();
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Invalid or missing `message`" },
        { status: 400 }
      );
    }
    if (typeof link !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing `link`" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        link,
        department: department ?? null,
        supervisorId: supervisorId ?? null,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
