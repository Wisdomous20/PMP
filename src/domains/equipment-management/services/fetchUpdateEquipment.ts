export default async function fetchUpdateEquipment(equipmentId : string, equipment : Equipment) {
  const endpoint = `/api/equipment-management/${equipmentId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update equipment:", error);
    throw error;
  }
}