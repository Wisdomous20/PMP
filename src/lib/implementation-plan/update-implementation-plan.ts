"use server";

import client from '@/lib/database/client';
import validator from "@/lib/validators";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";

interface UpdateImplementationPlanResult extends GenericFailureType {
  data?: {
    created: boolean;
    id: string | null;
  }
}

export async function updateImplementationPlan(serviceRequestId: string, tasks: Task[]): Promise<UpdateImplementationPlanResult> {
  const validation = await validator.validate({ serviceRequestId, tasks }, {
    properties: {
      serviceRequestId: {type :"string", formatter: "non-empty-string"},
      tasks: {
        type: "array",
        formatterFn: async (values) => {
          for (const value of values) {
            const innerValidation = await validator.validate(value, {
              properties: {
                id: {
                  type: "string",
                  formatterFn: async (id) => {
                    if (id) {
                      const strVal = validator.getFormatterFunction("string", "non-empty-string")!;
                      if (strVal) {
                        return await strVal(id);
                      }

                      if (!(/[a-f0-9]{24}/g.test(id))) {
                        return {
                          ok: false,
                          error: "Invalid task ID.",
                        }
                      }
                    }

                    return { ok: true }
                  }
                },
                name: {type: "string", formatter: "non-empty-string"},
                startTime: {type: "date"},
                endTime: {type: "date"},
                checked: {type: "boolean"},
              },
              requiredProperties: ["name", "startTime", "endTime", "checked"],
            });

            if (!innerValidation.ok) {
              return {
                ok: false,
                error: validator.toPlainErrors(innerValidation.errors),
              }
            }
          }

          return { ok: true }
        }
      }
    },
    requiredProperties: ["serviceRequestId", "tasks"],
  });

  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }

  const existingPlan = await client.implementationPlan.findUnique({
    where: { serviceRequestId },
    include: { tasks: { include: { assignments: true } } }
  });

  if (!existingPlan) {
    return {
      code: ErrorCodes.SERVICE_REQUEST_NOT_FOUND,
      message: "Service request ID specified does not exist.",
    };
  }

  try {
    const taskId = await client.$transaction(async (tx) => {
      let taskId: string | null = null;

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
          const created = await tx.task.create({
            data: {
              name: task.name,
              startTime: task.startTime,
              endTime: task.endTime,
              checked: task.checked,
              implementationPlanId: existingPlan.id
            },
          });

          taskId = created.id;
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

      return taskId;
    });

    return {
      code: ErrorCodes.OK,
      data: {
        created: taskId !== null,
        id: taskId,
      }
    };
  } catch {
    return {
      code: ErrorCodes.IMPLEMENTATION_PLAN_UPDATE_FAILED,
      message: "An error occurred while updating the implementation plan. Please try again later.",
    }
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
        status: status,
        updatedAt: new Date()
      },
      include: {
        serviceRequest: true,
        tasks: true
      }
    });

    if (status === "completed") {
      await prisma.serviceRequestStatus.create({
        data: {
          serviceRequestId: serviceRequestId,
          status: "completed",
          timestamp: new Date(),
          note: "implementation plan completed",
        },
      });
    }

  } catch (error) {
    console.error('DB Service: Update failed:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}