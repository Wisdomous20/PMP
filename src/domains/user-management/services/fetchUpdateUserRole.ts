export default async function fetchUpdateUserRole(userId: string, newRole: UserRole): Promise<unknown> {
  const endpoint = `/api/user`;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newRole }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    return null;
  }
}