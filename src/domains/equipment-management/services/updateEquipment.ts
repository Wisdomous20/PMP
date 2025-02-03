import { prisma } from "@/lib/prisma";

export default async function updateEquipment(
  id: string,
  data: {
    quantity: number;
    description: string;
    brand: string;
    serialNumber: string;
    supplier: string;
    unitCost: number;
    totalCost: number;
    datePurchased: Date;
    dateReceived: Date;
    status: EquipmentStatus
    location: string;
    department: string;
    serviceRequestId: string;
  }
) {
  try {
    const equipment = await prisma.equipment.update({
      where: { id },
      data,
    });

    return equipment;
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw new Error("Failed to update equipment");
  }
}