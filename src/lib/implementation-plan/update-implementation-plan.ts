"use server";

import client from '@/lib/database/client';
import addCompletedStatus from "@/domains/service-request/services/status/addCompletedStatus";

export async function updateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  const existingPlan = await client.implementationPlan.findUnique({
    where: { serviceRequestId },
    include: { tasks: { include: { assignments: true } } }
  });

  if (existingPlan) {
    await client.$transaction(async (tx) => {
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

export async function updateImplementationPlanStatus(
  serviceRequestId: string,
  status: string
) {
  try {
    const existingPlan = await prisma.implementationPlan.findUnique({
      where: { serviceRequestId },
    });

    if (!existingPlan) {
      console.error('DB Service: Plan not found:', serviceRequestId);
      throw new Error('Implementation plan not found');
    }

    await prisma.implementationPlan.update({
      where: {
        serviceRequestId
      },
      data: {
        status: status
      },
      include: {
        serviceRequest: true,
        tasks: true
      }
    });

    if (status === "completed") {
      await addCompletedStatus(existingPlan.serviceRequestId);
    }    
  
  } catch (error) {
    console.error('DB Service: Update failed:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}