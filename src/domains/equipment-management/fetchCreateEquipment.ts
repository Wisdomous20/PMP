export default async function fetchCreateEquipment(name: string, department: string) : Promise<{
  id: string;
  name: string;
  department: string;
}> {
  const endpoint = "/api/equipment-management";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, department }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to create equipment:", error);
    throw error;
  }
}