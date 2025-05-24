import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function getImplementationPlans(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_type: true, department: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userType = user.user_type;
    const department = user.department;
    let where: Prisma.ImplementationPlanWhereInput = {};

    if (userType === "SUPERVISOR" && department) {
      where = {
        serviceRequest: {
          user: {
            department: department,
          },
        },
      };
    } else if (userType === "USER") {
      where = {
        serviceRequest: {
          userId: userId,
        },
      };
    }

    const plans = await prisma.implementationPlan.findMany({
      where,
      select: {
        id: true,
        description: true,
        tasks: true,
        files: true,
        createdAt: true,
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

    const nonArchivedPlans = plans.filter(plan => {
      const mostRecentStatus = plan.serviceRequest.status[0];
      return !mostRecentStatus || mostRecentStatus.status !== "archived";
    });

    return nonArchivedPlans;
  } catch (error) {
    console.error("Error retrieving implementation plans:", error);
    throw error;
  }
}