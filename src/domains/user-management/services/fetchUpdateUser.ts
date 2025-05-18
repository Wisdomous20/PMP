import { User } from "@prisma/client";

export default async function fetchUpdateUser(
  userId: string,
  newRole: User["user_type"],
  pendingLimit: number
): Promise<unknown> {
  const endpoint = `/api/user`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole, pendingLimit }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
}