"use server";

import client from "@/lib/database/client";

export async function getAllUsers() {
  try {
    const users = await client.user.findMany({
      orderBy: {
        id: "desc", // Sort with latest user first
      },
    });

    return users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to find users.")
  }
}