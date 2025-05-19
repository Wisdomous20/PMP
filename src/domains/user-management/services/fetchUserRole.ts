export async function fetchUserRole(userId: string): Promise<UserRole> {
    const response = await fetch(`/api/auth/user-role`, {
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
  
    const data = await response.json();
    return data.userRole;
  }