"use server";

import client from "@/lib/database/client";

export async function getPersonnelAssignmentsByImplementationPlanId(implementationPlanId: string) {
  try {
    const implementationPlan = await client.implementationPlan.findUnique({
      where: { id: implementationPlanId },
    });

    if (!implementationPlan) {
      throw new Error("Implementation plan not found");
    }

    const tasks = await client.task.findMany({
      where: { implementationPlanId },
      select: { id: true },
    });

    const taskIds = tasks.map(task => task.id);

    const personnelAssignments = await client.personnelAssignment.findMany({
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