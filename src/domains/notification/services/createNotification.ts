import { NotificationType, Notification } from '@prisma/client';

import { prisma } from "@/lib/prisma";

export async function createNotification(
  type: NotificationType,
  message: string,
  link: string
): Promise<Notification> {
  const notification = await prisma.notification.create({
    data: {
      type,
      message,
      link,
    },
  });

  return notification;
}
