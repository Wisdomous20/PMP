import { prisma } from '@/lib/prisma';

export default async function updateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  const existingPlan = await prisma.implementationPlan.findUnique({
    where: { serviceRequestId },
  });

  if (existingPlan) {
    await prisma.implementationPlan.update({
      where: { id: existingPlan.id },
      data: {
        tasks: {
          deleteMany: {},
          create: tasks.map(task => ({
            id: task.id,
            name: task.name,
            deadline: task.deadline,
            checked: task.checked,
          })),
        },
      },
    });
  }
}
