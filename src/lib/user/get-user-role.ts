import client from "@/lib/database/client";

export async function getUserRole(userId: string) : Promise<string> {
  const user = await client.user.findUnique({
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
