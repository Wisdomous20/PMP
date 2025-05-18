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