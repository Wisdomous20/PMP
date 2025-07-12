"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import type { GenericFailureType } from "@/lib/types/GenericFailureType";
import { Prisma } from "@prisma/client";

const query = Prisma.validator<Prisma.ImplementationPlanFindFirstArgs>()({
  include: {
    tasks: {
      include: {
        assignments: {
          include: {
            personnel: true,
          },
        },
      },
    },
    serviceRequest: {
      include: {
        user: true,
        status: {
          orderBy: { timestamp: "asc" },
        },
        supervisorAssignment: {
          include: {
            supervisor: true,
          },
        },
      },
    },
  },
});

export type ImplementationPlanPayload = Prisma.ImplementationPlanGetPayload<typeof query>;

interface ImplementationPlanResult extends GenericFailureType {
  data?: ImplementationPlanPayload;
}

export async function getImplementationPlanByServiceRequestId(serviceRequestId: string): Promise<ImplementationPlanResult> {
  const impl = await client.implementationPlan.findFirst({
    ...query,
    where: { serviceRequestId },
  });

  if (!impl) {
    return {
      code: ErrorCodes.IMPLEMENTATION_PLAN_NOT_FOUND,
      message: "Implementation plan not found",
    };
  }

  return {
    code: ErrorCodes.OK,
    data: impl
  };
}
