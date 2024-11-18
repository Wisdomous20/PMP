export default async function getUserRoleFetch(userId : string) {
  const endpoint = `/api/auth/user-role`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    throw error;
  }
}
