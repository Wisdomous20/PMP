import { prisma } from '@/lib/prisma';

export default async function updateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  const existingPlan = await prisma.implementationPlan.findUnique({
    where: { serviceRequestId },
    include: { tasks: { include: { assignments: true } } }
  });

  if (existingPlan) {
    await prisma.$transaction(async (tx) => {
      for (const task of tasks) {
        if (task.id.length !== 13) {
          await tx.task.update({
            where: { id: task.id },
            data: {
              name: task.name,
              startTime: task.startTime,
              endTime: task.endTime,
              checked: task.checked,
            },
          });
        } else {
          await tx.task.create({
            data: {
              name: task.name,
              startTime: task.startTime,
              endTime: task.endTime,
              checked: task.checked,
              implementationPlanId: existingPlan.id
            },
          });
        }
      }
      
      const existingTaskIds = existingPlan.tasks.map(t => t.id);
      const updatedTaskIds = tasks.filter(t => t.id).map(t => t.id);
      const tasksToDelete = existingTaskIds.filter(id => !updatedTaskIds.includes(id));
      
      if (tasksToDelete.length > 0) {
        await tx.task.deleteMany({
          where: { id: { in: tasksToDelete } },
        });
      }
    });
  }
}