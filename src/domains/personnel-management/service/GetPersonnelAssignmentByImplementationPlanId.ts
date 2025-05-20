import { prisma } from "@/lib/prisma";

export default async function getPersonnelAssignmentsByImplementationPlanId(implementationPlanId: string) {
  try {
    const implementationPlan = await prisma.implementationPlan.findUnique({
      where: { id: implementationPlanId },
    });

    if (!implementationPlan) {
      throw new Error("Implementation plan not found");
    }

    const tasks = await prisma.task.findMany({
      where: { implementationPlanId },
      select: { id: true },
    });

    const taskIds = tasks.map(task => task.id);

    const personnelAssignments = await prisma.personnelAssignment.findMany({
      where: {
        taskId: { in: taskIds },
      },
      include: {
        personnel: true,
        task: true,
      },
    });

    return personnelAssignments;
  } catch (error) {
    console.error("Error retrieving personnel assignments:", error);
    throw error;
  }
}