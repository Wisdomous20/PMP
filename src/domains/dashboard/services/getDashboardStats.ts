import { prisma } from "@/lib/prisma";
import { subDays, startOfWeek, endOfWeek } from "date-fns";

export async function getDashboardStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { user_type: true, department: true },
  });
  if (!user) throw new Error("User not found");

  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const previousWeekStart = subDays(currentWeekStart, 7);
  const previousWeekEnd = subDays(currentWeekStart, 1);

  const deptFilter = user.user_type === "SUPERVISOR" 
    ? { user: { department: user.department } }
    : {};

  const planDeptFilter = user.user_type === "SUPERVISOR"
    ? { serviceRequest: { user: { department: user.department } } }
    : {};

  const totalPlans = await prisma.implementationPlan.count({
    where: planDeptFilter,
  });
  const completedPlans = await prisma.implementationPlan.count({
    where: { ...planDeptFilter, status: "completed" },
  });
  const inProgressPlans = await prisma.implementationPlan.count({
    where: { ...planDeptFilter, status: "in_progress" },
  });

  const currentTotalPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });
  const currentCompletedPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      status: "completed",
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });
  const currentInProgressPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      status: "in_progress",
      createdAt: { gte: currentWeekStart, lte: currentWeekEnd },
    },
  });

  const prevTotalPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });
  const prevCompletedPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      status: "completed",
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });
  const prevInProgressPlans = await prisma.implementationPlan.count({
    where: {
      ...planDeptFilter,
      status: "in_progress",
      createdAt: { gte: previousWeekStart, lte: previousWeekEnd },
    },
  });

  const pendingRequestsData = await prisma.serviceRequest.findMany({
    where: {
      ...deptFilter,
      status: { some: { status: "pending" } },
      ...(user.user_type === "SUPERVISOR" ? {
        supervisorAssignment: {
          supervisorId: userId
        }
      } : {})
    },
    include: {
      status: {
        orderBy: { timestamp: "desc" },
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

  const totalPlansDelta = currentTotalPlans - prevTotalPlans;
  const completedPlansDelta = currentCompletedPlans - prevCompletedPlans;
  const inProgressPlansDelta = currentInProgressPlans - prevInProgressPlans;
  const pendingRequestsDelta = currentPendingRequests - prevPendingRequests;

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