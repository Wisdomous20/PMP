"use server";

import client from "@/lib/database/client";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import { ErrorCodes } from "../ErrorCodes";

interface ProgressResult extends GenericFailureType {
  data?: Array<{
    id: string,
    concern: string,
    details: string,
    tasks: number,
    progress: number
  }>
}

function calculateProgress(tasks: { checked: boolean }[]): number {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.checked).length
  return Math.round((completedTasks / tasks.length) * 100)
}

export async function getImplementationPlansInProgress(): Promise<ProgressResult> {
  const plans = await client.implementationPlan.findMany({
    where: {
      status: "in_progress"
    },
    include: {
      tasks: true,
      serviceRequest: true,
    }
  })

  const data = plans.map(plan => ({
    id: plan.id,
    concern: plan.serviceRequest?.concern || "No concern provided",
    details: plan.description,
    tasks: plan.tasks.length,
    progress: calculateProgress(plan.tasks),
  }))

  return {
    code: ErrorCodes.OK,
    data
  }
}
