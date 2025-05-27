interface UserDepartmentObject {
  department: string;
}

export default async function getUserDepartmentFetch(
  userId: string
): Promise<UserDepartmentObject> {
  const endpoint = "/api/auth/user-department";

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
}
