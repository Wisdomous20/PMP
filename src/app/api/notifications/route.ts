import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const NOTIFICATION_TYPES = [
  "inventory",
  "service_request",
  "implementation_plan",
  "personnel",
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
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
    const { type, message, link } = await req.json();

    if (!NOTIFICATION_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid or missing `type`" },
        { status: 400 }
      );
    }
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