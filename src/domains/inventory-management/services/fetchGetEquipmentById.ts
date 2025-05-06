export default async function fetchGetEquipmentById(serviceRequestId: string): Promise<Equipment[]> {
  const endpoint = `/api/equipment-management/${serviceRequestId}`;

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

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Failed to fetch equipment:", error);
    return [];
  }
}