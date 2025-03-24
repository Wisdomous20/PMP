import { prisma } from "@/lib/prisma";

export default async function addPersonnelToTask(taskId: string, personnelId: string)
: Promise<{ id: string; taskId: string; personnelId: string; assignedAt: Date | null}> {
  try {
    // Validate Task Exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Validate Personnel Exists
    const personnel = await prisma.personnel.findUnique({
      where: { id: personnelId },
    });

    if (!personnel) {
      throw new Error("Personnel not found");
    }

    // Create Personnel Assignment
    const personnelAssignment = await prisma.personnelAssignment.create({
      data: {
        taskId, // Now linking to Task instead of ImplementationPlan
        personnelId,
      },
    });

    return personnelAssignment;
  } catch (error) {
    console.error("Error adding personnel to task:", error);
    throw new Error("Failed to add personnel to task");
  }
}
