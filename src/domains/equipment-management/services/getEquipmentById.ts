import { prisma } from "@/lib/prisma";

export default async function getEquipmentById(serviceRequestId: string) {
  try {
    const equipment = await prisma.equipment.findMany({
      where: { 
        serviceRequestId: serviceRequestId 
      }
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    return equipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw new Error("Failed to fetch equipment");
  }
}