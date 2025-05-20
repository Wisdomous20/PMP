import { prisma } from "@/lib/prisma";

export default async function removePersonnelFromTask(taskId: string, personnelId: string): Promise<void> {
  try {
    const existingAssignment = await prisma.personnelAssignment.findFirst({
      where: {
        taskId,
        personnelId,
      },
    });

    if (!existingAssignment) {
      throw new Error("Personnel assignment not found");
    }

    await prisma.personnelAssignment.delete({
      where: {
        id: existingAssignment.id,
      },
    });
  } catch (error) {
    console.error("Error removing personnel from task:", error);
    throw new Error("Failed to remove personnel from task");
  }
}