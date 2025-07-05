"use server";

import client from "@/lib/database/client";

export async function updateUser(
  userId: string,
  newRole: UserRole,
  pendingLimit: number
) {
  try {
    return await client.user.update({
      where: { id: userId },
      data: { user_type: newRole, pendingLimit },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}