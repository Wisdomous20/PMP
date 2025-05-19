import { prisma } from "@/lib/prisma";

export default async function deleteUser(id: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}