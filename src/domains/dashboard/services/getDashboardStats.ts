import { prisma } from "@/lib/prisma";
import { subDays, startOfWeek, endOfWeek } from "date-fns";

export async function getDashboardStats() {
  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const previousWeekStart = subDays(currentWeekStart, 7);
  const previousWeekEnd = subDays(currentWeekStart, 1);

  const totalPlans = await prisma.implementationPlan.count();
  const completedPlans = await prisma.implementationPlan.count({
    where: { status: "completed" },
  });
  const inProgressPlans = await prisma.implementationPlan.count({
    where: { status: "in_progress" },
  });

  const currentTotalPlans = await prisma.implementationPlan.count({
    where: {
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });
  const currentCompletedPlans = await prisma.implementationPlan.count({
    where: {
      status: "completed",
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });
  const currentInProgressPlans = await prisma.implementationPlan.count({
    where: {
      status: "in_progress",
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });

  // Previous week counts
  const prevTotalPlans = await prisma.implementationPlan.count({
    where: {
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });
  const prevCompletedPlans = await prisma.implementationPlan.count({
    where: {
      status: "completed",
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });
  const prevInProgressPlans = await prisma.implementationPlan.count({
    where: {
      status: "in_progress",
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });

  // Pending requests - using first status timestamp
  const pendingRequestsData = await prisma.serviceRequest.findMany({
    where: {
      status: { some: { status: "pending" } },
    },
    include: {
      status: {
        orderBy: { timestamp: "asc" },
        take: 1,
      },
    },
  });

  const pendingRequests = pendingRequestsData.length;

  const currentPendingRequests = pendingRequestsData.filter(
    (req) =>
      req.status[0]?.timestamp >= currentWeekStart &&
      req.status[0]?.timestamp <= currentWeekEnd
  ).length;

  const prevPendingRequests = pendingRequestsData.filter(
    (req) =>
      req.status[0]?.timestamp >= previousWeekStart &&
      req.status[0]?.timestamp <= previousWeekEnd
  ).length;

  // Calculate deltas
  const totalPlansDelta = currentTotalPlans - prevTotalPlans;
  const completedPlansDelta = currentCompletedPlans - prevCompletedPlans;
  const inProgressPlansDelta = currentInProgressPlans - prevInProgressPlans;
  const pendingRequestsDelta = currentPendingRequests - prevPendingRequests;

  // Calculate percentages
  const completionRate = totalPlans
    ? Math.round((completedPlans / totalPlans) * 100)
    : 0;
  const inProgressPercentage = totalPlans
    ? Math.round((inProgressPlans / totalPlans) * 100)
    : 0;

  return {
    totalPlans,
    completedPlans,
    inProgressPlans,
    pendingRequests,
    totalPlansDelta,
    completedPlansDelta,
    inProgressPlansDelta,
    pendingRequestsDelta,
    completionRate,
    inProgressPercentage,
  };
}
