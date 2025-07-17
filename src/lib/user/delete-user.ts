"use server";

import client from "@/lib/database/client";

export async function deleteUser(email: string) {
  try {
    return await client.user.delete({ where: { email } });
  } catch {
    throw new Error("Failed to delete user")
  }
}