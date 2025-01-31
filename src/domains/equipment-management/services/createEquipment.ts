import { prisma } from "@/lib/prisma";

export default async function createEquipment(
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
  try {
    const equipment = await prisma.equipment.create({
      data: {
        ...input,
        status: "Operational", // Default status
      },
    });

    return equipment;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw new Error("Failed to create equipment");
  }
}
