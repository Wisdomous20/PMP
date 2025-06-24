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

  const deptFilter =
    user.user_type === "SUPERVISOR"
      ? { user: { department: user.department } }
      : {};

  const planDeptFilter =
    user.user_type === "SUPERVISOR"
      ? { serviceRequest: { user: { department: user.department } } }
      : {};

  const allPlans = await prisma.implementationPlan.findMany({
    where: planDeptFilter,
    include: {
      tasks: true,
    },
  });

  const totalPlans = allPlans.length;

  const completedPlans = allPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks === totalTasks;
  }).length;

  const inProgressPlansInitial = allPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;

    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    const isInProgress = completedTasks > 0 && completedTasks < totalTasks;

    const isPending = plan.status === "pending";

    return isInProgress && isPending;
  });

  const inProgressPlans = inProgressPlansInitial.length;

  const currentPlans = allPlans.filter(
    (plan) =>
      plan.createdAt >= currentWeekStart && plan.createdAt <= currentWeekEnd
  );

  const currentTotalPlans = currentPlans.length;

  const currentCompletedPlans = currentPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks === totalTasks;
  }).length;

  const currentInProgressPlansInitial = currentPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks > 0 && completedTasks < totalTasks;
  });

  const currentInProgressPlans = currentInProgressPlansInitial.length;

  const prevPlans = allPlans.filter(
    (plan) =>
      plan.createdAt >= previousWeekStart && plan.createdAt <= previousWeekEnd
  );

  const prevTotalPlans = prevPlans.length;

  const prevCompletedPlans = prevPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks === totalTasks;
  }).length;

  const prevInProgressPlans = prevPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks > 0 && completedTasks < totalTasks;
  }).length;

  const serviceRequestsWithStatus = await prisma.serviceRequest.findMany({
    where: {
      ...deptFilter,
      ...(user.user_type === "SUPERVISOR"
        ? {
            supervisorAssignment: {
              supervisorId: userId,
            },
          }
        : {}),
    },
    include: {
      status: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
  });

  const pendingRequestsData = serviceRequestsWithStatus.filter(
    (req) => req.status.length > 0 && req.status[0].status === "pending"
  );

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
