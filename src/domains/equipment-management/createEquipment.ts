import { prisma } from "@/lib/prisma";

export default async function createEquipment(name: string, department: string) : Promise<{
  id: string;
  name: string;
  department: string;
}> {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        name,
        department,
        status: {
          create: {
            status: "available", 
            timestamp: new Date(),
          },
        },
      },
    });

    return equipment;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw new Error("Failed to create equipment");
  }
}