import {prisma} from "@/lib/prisma";

export default async function getAllEquipment() {
  try {
    const equipment = await prisma.equipment.findMany();

    return equipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw new Error("Failed to fetch equipment");
  }
}