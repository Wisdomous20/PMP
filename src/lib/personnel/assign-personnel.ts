"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes"
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface PersonnelTask {
  id: string;
  taskId: string;
  personnelId: string;
  assignedAt: Date | null
}

interface PersonnelTaskResult extends GenericFailureType {
  data?: PersonnelTask;
}

export async function addPersonnelToTask(taskId: string, personnelId: string)
: Promise<PersonnelTaskResult> {
  try {
    console.log("task id: ", taskId)
    // Validate Task Exists
    const task = await client.task.findUnique({
      where: { id: taskId },
    });

    console.log("task: ", task)

    if (!task) {
      throw new Error("Task not found");
    }

    // Validate Personnel Exists
    const personnel = await client.personnel.findUnique({
      where: { id: personnelId },
    });

    if (!personnel) {
      throw new Error("Personnel not found");
    }

    // Create Personnel Assignment
    const personnelAssignment = await client.personnelAssignment.create({
      data: {
        taskId, // Now linking to Task instead of ImplementationPlan
        personnelId,
      },
    });

    return {
      code: ErrorCodes.OK,
      data: personnelAssignment
    };
  } catch (error) {
    console.error("Error adding personnel to task:", error);
    throw new Error("Failed to add personnel to task");
  }
}
