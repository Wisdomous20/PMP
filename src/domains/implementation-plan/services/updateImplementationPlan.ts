import { prisma } from '@/lib/prisma';

export default async function updateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  return await prisma.implementationPlan.update({
    where: { id: serviceRequestId },
    data: {
      tasks: {
        deleteMany: {},
        create: tasks,
      },
    },
  });
}
