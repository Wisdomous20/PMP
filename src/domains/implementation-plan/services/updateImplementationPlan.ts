import { prisma } from '../../../../src/lib/prisma';
import handleCompletedStatus from './handleCompletedStatus';

export default async function updateImplementationPlan(
  serviceRequestId: string,
  tasks: Task[],
  status?: string
) {
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
            endTime: task.endTime,
            startTime: task.startTime,
          })),

        },
        ...(status && { status }),
      },
    });

    if (status === 'completed') {
      await handleCompletedStatus(serviceRequestId);
    }
  }
}
