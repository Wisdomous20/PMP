export default async function fetchGetAllEquipment(): Promise<Equipment[] | null> {
  const endpoint = `/api/equipment-management`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on each request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const data = (await response.json()) as Equipment[];
    return data;
  } catch (error) {
    console.error("Failed to fetch equipment:", error);
    return null;
  }
}