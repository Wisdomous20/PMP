"use server";

import client from "@/lib/database/client";
import type {User} from "@prisma/client";

export async function getNotifications(user: User) {
  let whereClause = {};
  if (user.user_type === "ADMIN" || user.user_type === "SECRETARY") {
    whereClause = {};
  } else if (user.user_type === "SUPERVISOR") {
    whereClause = { department: user.department };
  } else {
    whereClause = { supervisorId: user.id };
  }

  const notifications = await client.notification.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return notifications;
}
