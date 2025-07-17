"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import {GenericFailureType} from "@/lib/types/GenericFailureType";
import {Prisma} from "@prisma/client";

const peronnelAssignmentFindManyQuery = Prisma.validator<Prisma.PersonnelAssignmentFindManyArgs>()({
  include: {
    personnel: true,
    task: true,
  },
});

export type PersonnelAssignment = Array<Prisma.PersonnelAssignmentGetPayload<typeof peronnelAssignmentFindManyQuery>>;

interface GetPersonnelAssignmentsResult extends GenericFailureType {
  data?: PersonnelAssignment;
}

export async function getPersonnelAssignmentsByImplementationPlanId(implementationPlanId: string): Promise<GetPersonnelAssignmentsResult> {
  const implementationPlan = await client.implementationPlan.findUnique({
    where: { id: implementationPlanId },
  });

  if (!implementationPlan) {
    return {
      code: ErrorCodes.IMPLEMENTATION_PLAN_NOT_FOUND,
      message: "Implementation plan not found",
    };
  }

  const tasks = await client.task.findMany({
    where: { implementationPlanId },
    select: { id: true },
  });

  const taskIds = tasks.map(task => task.id);

  const personnelAssignments = await client.personnelAssignment.findMany({
    where: {
      taskId: { in: taskIds },
    },
    ...peronnelAssignmentFindManyQuery,
  });

  return {
    code: ErrorCodes.OK,
    data: personnelAssignments,
  };
}
