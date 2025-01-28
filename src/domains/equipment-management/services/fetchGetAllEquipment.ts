export default async function fetchGetAllEquipment() {
  const endpoint = `/api/equipment-management`;

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

    return await response.json() as Equipment[];
  } catch (error) {
    console.error("Failed to fetch equipment:", error);
    return null
  }
}