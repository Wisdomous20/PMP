import { prisma } from "@/lib/prisma";

export default async function createEquipment(
  description: string,
  brand: string,
  serialNumber: string,
  supplier: string,
  UnitCost: number,
  TotalCost: number,
  DatePurchased: Date,
  DateRecieved: Date,
  location: string,
  department: string,
  serviceRequestId: string
): Promise<{
  id: string;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  UnitCost: number;
  TotalCost: number;
  DatePurchased: Date;
  DateRecieved: Date;
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
        UnitCost,
        TotalCost,
        DatePurchased,
        DateRecieved,
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