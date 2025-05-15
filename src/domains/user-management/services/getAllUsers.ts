import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export default async function getAllUsers(): Promise<User[]> {
  try {
    const allUsers = await prisma.user.findMany({
      where: {
        isVerified: true,
      },
    });
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}
