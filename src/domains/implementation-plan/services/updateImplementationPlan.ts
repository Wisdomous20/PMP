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
          deleteMany: {}, // Clear previous tasks
          create: tasks.map(task => ({
            name: task.name,
            startTime: task.startTime, // Updated field
            endTime: task.endTime, // Updated field
            checked: task.checked,
          })),
        },
      },
    });
  }
}
