"use server";

import type { User } from "@prisma/client";

export async function getImplementationPlans({ user_type, department, id }: User) {
  const plans = await prisma.implementationPlan.findMany({
    where: {
      serviceRequest: {
        ...(user_type === "SUPERVISOR" && department
          ? {
            user: {
              department: department,
            },
          }
          : {
            userId: id,
          })
      }
    },
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
  }))
}
