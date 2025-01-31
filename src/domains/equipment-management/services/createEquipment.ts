import { prisma } from "@/lib/prisma";

export default async function createEquipment(
  description: string,
  brand: string,
  quantity: number,
  serialNumber: string,
  supplier: string,
  unitCost: number,
  totalCost: number,
  datePurchased: Date,
  dateRecieved: Date,
  location: string,
  department: string,
  serviceRequestId: string | null
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
  dateRecieved: Date;
  status: string;
  location: string;
  department: string;
  serviceRequestId: string | null;
}> {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        description,
        brand,
        quantity,
        serialNumber,
        supplier,
        unitCost,
        totalCost,
        datePurchased,
        dateRecieved,
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