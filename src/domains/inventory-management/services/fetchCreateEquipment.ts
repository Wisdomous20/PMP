export default async function fetchCreateEquipment(
  input: EquipmentInput
): Promise<Equipment> {
  const endpoint = "/api/equipment-management";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
       
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to create equipment:", error);
    throw error;
  }
}
