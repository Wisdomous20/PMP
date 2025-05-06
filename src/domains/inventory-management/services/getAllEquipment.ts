import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function getAllEquipment() {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { datePurchased: "desc" },
    });

    return equipment;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }

    throw new Error("Failed to fetch equipment");
  }
}
