import { prisma } from "@/lib/prisma";

export default async function createEquipment(
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
  try {
    const equipment = await prisma.equipment.create({
      data: {
        description,
        brand,
        serialNumber,
        supplier,
        unit_cost,
        total_cost,
        date_purchased,
        date_recieved,
        status: "Operational", 
        location,
        department,
        serviceRequestId,
      },
    });

    return equipment;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw new Error("Failed to create equipment");
  }
}