import { prisma } from "@/lib/prisma";

export default async function getImplementationPlansByUser(
  implementationPlanId: string,
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let implementationPlans;

  if (user.user_type === "ADMIN") {
    const plan = await prisma.implementationPlan.findUnique({
      where: { id: implementationPlanId },
      include: {
        tasks: true,
        files: true,
        serviceRequest: true,
      },
    });
    implementationPlans = plan ? [plan] : [];
  } else if (user.user_type === "SUPERVISOR") {
    implementationPlans = await prisma.implementationPlan.findMany({
      where: {
        id: implementationPlanId,
        serviceRequest: {
          supervisorAssignment: {
            some: {
              supervisorId: userId,
            },
          },
        },
      },
      include: {
        tasks: true,
        files: true,
        serviceRequest: true,
      },
    });
  } else {
    throw new Error("Invalid user type");
  }

  if (implementationPlans.length === 0) {
    throw new Error("Implementation plans not found or access denied");
  }

  return implementationPlans.map((plan) => {
    const { id, description, status, tasks, files, serviceRequest } = plan;
    return {
      id,
      description,
      status,
      tasks,
      files,
      serviceRequest,
    };
  });
}
