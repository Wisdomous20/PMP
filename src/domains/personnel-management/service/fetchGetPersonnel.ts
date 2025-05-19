export default async function fetchGetpersonnel(): Promise<Personnel[]> {
  const endpoint = `/api/manpower-management`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to fetch personnel:", error);
    throw error;
  }
}
