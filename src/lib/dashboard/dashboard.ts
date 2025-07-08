"use server";

import client from "@/lib/database/client";
import type { User } from "@prisma/client";
import { subDays, startOfWeek, endOfWeek } from "date-fns";

export async function getDashboardStats(user: User) {
  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const previousWeekStart = subDays(currentWeekStart, 7);
  const previousWeekEnd = subDays(currentWeekStart, 1);

  const planDeptFilter =
    user.user_type === "SUPERVISOR"
      ? { serviceRequest: { user: { department: user.department } } }
      : {};

  const allPlans = await client.implementationPlan.findMany({
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

  const inProgressPlans = allPlans.filter((plan) => {
    const totalTasks = plan.tasks.length;
    if (totalTasks === 0) return false;

    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    return completedTasks > 0 && completedTasks < totalTasks;
  }).length;

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

  const pendingRequests = allPlans.filter(plan => {
    if (plan.tasks.length === 0) return true;
    return plan.tasks.filter(task => task.checked).length === 0;
  }).length;

  const currentPendingRequests = allPlans.filter(plan => {
    const count = plan.tasks.filter(task => task.checked).length === 0;
    if (!count) return false;

    return plan.updatedAt >= currentWeekStart && plan.updatedAt <= currentWeekEnd;
  }).length;

  const prevPendingRequests = allPlans.filter(plan => {
    const count = plan.tasks.filter(task => task.checked).length === 0;
    if (!count) return false;

    return plan.updatedAt >= previousWeekStart && plan.updatedAt <= previousWeekEnd
  }).length;

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
