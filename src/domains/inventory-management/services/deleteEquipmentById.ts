import { prisma } from "@/lib/prisma";

export async function deleteEquipmentById(id: string) {
  try {
    await prisma.equipment.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw new Error("Failed to delete equipment");
  }
}