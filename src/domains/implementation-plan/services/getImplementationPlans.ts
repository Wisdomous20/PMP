import { prisma } from "@/lib/prisma";


export default async function getImplementationPlans(
  userId: string,
  department?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_type: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userType = user.user_type
    // Example filter logic for different user roles
let where: prisma.ImplementationPlanWhereInput = {};

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