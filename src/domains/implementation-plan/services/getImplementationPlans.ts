import { prisma } from "@/lib/prisma";

export default async function getImplementationPlans(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_type: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let implementationPlans;

    if (user.user_type === "ADMIN" || user.user_type === "SECRETARY") {
      implementationPlans = await prisma.implementationPlan.findMany({
        where: {
          serviceRequest: {
            status: {
              none: { status: "archived" },
            },
          },
        },
        include: {
          tasks: true,
          files: true,
          serviceRequest: { include: { user: true, status: true } },
        },
      });
    } else if (user.user_type === "SUPERVISOR") {
      implementationPlans = await prisma.implementationPlan.findMany({
        where: {
          AND: [
            {
              serviceRequest: {
                status: {
                  none: { status: "archived" },
                },
              },
            },
            {
              serviceRequest: {
                supervisorAssignment: { supervisorId: userId },
              },
            },
          ],
        },
        include: {
          tasks: true,
          files: true,
          serviceRequest: { include: { user: true, status: true } },
        },
      });
    } else if (user.user_type === "USER") {
      implementationPlans = await prisma.implementationPlan.findMany({
        where: {
          AND: [
            {
              serviceRequest: {
                status: {
                  none: { status: "archived" },
                },
              },
            },
            { serviceRequest: { userId } },
          ],
        },
        include: {
          tasks: true,
          files: true,
          serviceRequest: { include: { user: true, status: true } },
        },
      });
    } else {
      throw new Error("Invalid user type");
    }

    return implementationPlans;
  } catch (error) {
    console.error("Error retrieving implementation plans:", error);
    throw error;
  }
}
