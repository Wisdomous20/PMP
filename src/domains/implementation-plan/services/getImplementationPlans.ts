import { prisma } from "@/lib/prisma";

export default async function getImplementationPlans(userId: string, userType: string, department?: string) {
  try {
    // Build the filter for supervisor or admin
    let where: Record<string, unknown> = {};

    if (userType === "ADMIN") {
      // Admin: get all non-archived implementation plans
      where = {
        serviceRequest: {
          OR: [
            { status: null },
            {
              status: {
                some: {
                  status: { not: "archived" }
                }
              }
            }
          ]
        }
      };
    } else if (userType === "SUPERVISOR") {
      // Supervisor: get non-archived plans for their department
      where = {
        serviceRequest: {
          OR: [
            { status: null },
            {
              status: {
                some: {
                  status: { not: "archived" }
                }
              }
            }
          ],
          user: {
            department: department
          }
        }
      };
    }

    const implementationPlans = await prisma.implementationPlan.findMany({
      where,
      select: {
        id: true,
        description: true,
        createdAt: true,
        tasks: true,
        files: true,
        serviceRequest: {
          select: {
            id: true,
            user: true,
            status: true,
            supervisorAssignment: true
          }
        }
      }
    });

    // Defensive: ensure tasks is always an array
    return implementationPlans.map(plan => ({
      ...plan,
      tasks: plan.tasks ?? [],
    }));
  } catch (error) {
    console.error("Error retrieving implementation plans:", error);
    throw error;
  }
}