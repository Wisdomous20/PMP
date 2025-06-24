import { prisma } from "@/lib/prisma";

export default async function getUserRole(userId: string) : Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
      department: true,
    },
  });

  if (user?.user_type) {
    return user?.user_type;
  }

  return ""
}
