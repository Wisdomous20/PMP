"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import { NotificationType, Notification } from '@prisma/client';

interface NotificationResult extends GenericFailureType {
  data?: Notification;
}

export async function createNotification(
  type: NotificationType,
  message: string,
  link: string
): Promise<NotificationResult> {
  const notification = await client.notification.create({
    data: {
      type,
      message,
      link,
    },
  });

  return {
    code: ErrorCodes.OK,
    data: notification
  };
}
