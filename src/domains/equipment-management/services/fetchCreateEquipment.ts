export default async function fetchCreateEquipment(
  description: string,
  brand: string,
  serialNumber: string,
  supplier: string,
  unit_cost: number,
  total_cost: number,
  date_purchased: Date,
  date_recieved: Date,
  location: string,
  department: string,
  serviceRequestId: string
): Promise<{
  id: string;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  unit_cost: number;
  total_cost: number;
  date_purchased: Date;
  date_recieved: Date;
  status: string;
  location: string;
  department: string;
  serviceRequestId: string;
}> {
  const endpoint = "/api/auth/equipment-management";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        brand,
        serialNumber,
        supplier,
        unit_cost,
        total_cost,
        date_purchased,
        date_recieved,
        location,
        department,
        serviceRequestId,
      }),
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