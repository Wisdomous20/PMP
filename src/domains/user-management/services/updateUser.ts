import { prisma } from "@/lib/prisma";

export default async function updateUser(
  userId: string,
  newRole: UserRole,
  pendingLimit: number
) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { user_type: newRole, pendingLimit },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}