import { prisma } from "@/lib/prisma";

export default async function getUserDepartment(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { department: true },
  });

  return user?.department ?? "";
}
