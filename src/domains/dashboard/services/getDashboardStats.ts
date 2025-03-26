import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const totalPlans = await prisma.implementationPlan.count();

  const completedPlans = await prisma.implementationPlan.count({
    where: { status: "completed" },
  });

  const inProgressPlans = await prisma.implementationPlan.count({
    where: { status: "in_progress" },
  });

  const pendingRequestsData = await prisma.serviceRequest.findMany({
    where: {
      status: {
        some: {
          status: "pending",
        },
      },
    },
  });
  const pendingRequests = pendingRequestsData.length;

  return { totalPlans, completedPlans, inProgressPlans, pendingRequests };
}
