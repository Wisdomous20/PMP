export default async function fetchCreateEquipment(
  input: EquipmentInput
): Promise<{
  id: string;
  description: string;
  brand: string;
  quantity: number;
  serialNumber: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
  datePurchased: Date;
  dateReceived: Date;
  status: string;
  location: string;
  department: string;
  serviceRequestId: string | null;
}> {
  const endpoint = "/api/equipment-management";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
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
