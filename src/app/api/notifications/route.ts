import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNotifications } from "@/domains/notification/services/getNotifications";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "`userId` is required as a query parameter" },
        { status: 400 }
      );
    }

    const notifications = getNotifications(userId)

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
