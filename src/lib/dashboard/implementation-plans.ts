"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import type {User, Prisma} from "@prisma/client";

function getWhereClause(user_type: UserRole, department: string, id: string): Prisma.ImplementationPlanWhereInput {
  if (user_type === "ADMIN") {
    return {};
  }

  if (user_type === "SUPERVISOR") {
    return {
      serviceRequest: {
        user: {
          department,
        }
      }
    }
  }

  return {
    serviceRequest: {
      userId: id,
    }
  }
}

export async function getImplementationPlans({ user_type, department, id }: User) {
  const plans = await client.implementationPlan.findMany({
    where: getWhereClause(user_type, department, id),
    select: {
      id: true,
      description: true,
      tasks: true,
      files: true,
      createdAt: true,
      status: true,
      serviceRequest: {
        select: {
          id: true,
          concern: true,
          details: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
              email: true,
            },
          },
          status: {
            orderBy: {
              timestamp: 'desc'
            }
          },
          supervisorAssignment: true,
        },
      },
    },
  });

  return plans.filter(plan => {
    const mostRecentStatus = plan.serviceRequest.status[0];
    return !mostRecentStatus || mostRecentStatus.status !== "archived";
  }).map(x => ({
    ...x,
    requesterName: `${x.serviceRequest.user.firstName} ${x.serviceRequest.user.lastName}`,
    createdOn: x.serviceRequest.status.length > 0 ? x.serviceRequest.status[0].timestamp : null,
  }));
}

export interface GetImplementationPlansByUserIdResult extends GenericFailureType {
  data?: Awaited<ReturnType<typeof getImplementationPlans>>
}

export async function getImplementationPlansByUserId(userId: string): Promise<GetImplementationPlansByUserIdResult> {
  const user = await client.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    return {
      code: ErrorCodes.ACCOUNT_NOT_FOUND,
      message: "Account not found",
    };
  }

  const data = await getImplementationPlans(user);
  return {
    code: ErrorCodes.OK,
    data
  }
}
