import { prisma } from "@/lib/prisma";

export default async function getEquipmentById(id: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id }
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