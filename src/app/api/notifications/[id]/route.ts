import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { isRead } = await request.json();
    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead },
    });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
