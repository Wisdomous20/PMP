"use server";

import { $Enums } from "@prisma/client";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface NotificationResult extends GenericFailureType {
  data?: {
    link: string;
    id: string;
    department: string | null;
    createdAt: Date;
    supervisorId: string | null;
    type: $Enums.NotificationType;
    message: string;
    isRead: boolean;
  }
}

export async function updateNotification(id: string, isRead: boolean): Promise<NotificationResult> {
  try {
    const updatedNotification = await client.notification.update({
      where: { id: id },
      data: { isRead },
    });
    return {
      code: ErrorCodes.OK,
      data: updatedNotification
    }
  } catch {
    return {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Error updating notification"
    }
  }
}
