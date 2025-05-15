import { prisma } from "@/lib/prisma";

export async function getNotifications(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { user_type: true, department: true },
  });
  if (!user) {
    throw new Error("User not found");
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

  return notifications
}
