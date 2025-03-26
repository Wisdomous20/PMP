import { prisma } from "@/lib/prisma"

function calculateProgress(tasks: { checked: boolean }[]): number {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.checked).length
  return Math.round((completedTasks / tasks.length) * 100)
}

export async function getImplementationPlansInProgress() {
  const plans = await prisma.implementationPlan.findMany({
    where: {
      status: "in_progress"
    },
    include: {
      tasks: true,
      serviceRequest: true,
    }
  })

  return plans.map(plan => ({
    id: plan.id,
    concern: plan.serviceRequest?.concern || "No concern provided",
    details: plan.description,
    tasks: plan.tasks.length,
    progress: calculateProgress(plan.tasks),
  }))
}
