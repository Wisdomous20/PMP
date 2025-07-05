"use server"

import { NotificationType } from "@prisma/client";
import client from "@/lib/database/client"
import type { GenericFailureType } from "@/lib/types/GenericFailureType";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { createNotification } from "@/lib/notification/create-notification";

// Define Task Type
type Task = {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  checked: boolean;
};

interface CreateImplementationPlanResult extends GenericFailureType {
  data?: {
    id: string;
    serviceRequestId: string;
    description: string;
    status: string;
    tasks: Task[];
    serviceRequest: {
      concern: string;
    };
  };
}

export async function createImplementationPlan(
  serviceRequestId: string,
  tasks: Task[]
): Promise<CreateImplementationPlanResult> {
  const implementationPlan = await client.implementationPlan.create({
    data: {
      serviceRequestId,
      description: "",
      status: "pending",
      tasks: {
        create: tasks.map((task) => ({
          name: task.name,
          startTime: task.startTime,
          endTime: task.endTime,
          checked: task.checked,
        })),
      },
    },
    include: {
      tasks: true,
      serviceRequest: {
        select: {
          concern: true,
        },
      }
    },
  });

  await createNotification(
    NotificationType.implementation_plan,
    `An implementation plan was created for the Service Request ${implementationPlan.serviceRequest.concern}.`,
    `/service-requests/${serviceRequestId}`
  )

  return {
    code: ErrorCodes.OK,
    data: implementationPlan
  }
}