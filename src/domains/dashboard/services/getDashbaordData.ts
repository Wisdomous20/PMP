import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";
import { getPaginatedEquipment } from "@/domains/inventory-management/services/getPaginatedEquipment";
import { getNotifications } from "@/domains/notification/services/getNotifications";
import { getPendingServiceRequests } from "@/domains/service-request/services/getPendingServiceRequests";
import { getDashboardStats } from "./getDashboardStats";

export async function getDashboardData(userId: string) {
  const [
    implementationPlans,
    notifications,
    equipment,
    newServiceRequests,
    dashboardStats,
  ] = await Promise.all([
    // these functions might cause too much query overhead bcos
    // each function is checking the user id.
    // subject to change
    getImplementationPlans(userId),
    getNotifications(userId),
    getPaginatedEquipment({ page: 1, pageSize: 15, userId }),
    getPendingServiceRequests(userId),
    getDashboardStats(userId),
  ]);

  return {
    implementationPlans,
    notifications,
    equipment,
    newServiceRequests,
    dashboardStats,
  };
}