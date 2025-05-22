import { prisma } from "@/lib/prisma";

export default async function getImplementationPlans(
  userId: string,
  userType: string,
  department?: string
) {
  try {
    // Example filter logic for different user roles
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
    // Add more role-based filters as needed

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
            concern: true, // <-- Ensure this is included!
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                department: true,
              },
            },
            status: true,
            supervisorAssignment: true,
          },
        },
      },
    });

    return plans;
  } catch (error) {
    console.error("Error retrieving implementation plans:", error);
    throw error;
  }
}