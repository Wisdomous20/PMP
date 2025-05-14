import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";
import { getPaginatedEquipment } from "@/domains/inventory-management/services/getPaginatedEquipment";
import { fetchNotifications } from "@/domains/notification/services/fetchNotifications";
import { getPendingServiceRequests } from "@/domains/service-request/services/getPendingServiceRequests";
import { getDashboardStats } from "./getDashboardStats";

export async function getDashboardData(userId : string) {

  const implementationPlans = getImplementationPlans(userId)
  const notifications = fetchNotifications()
  const equipment = getPaginatedEquipment({page: 1, pageSize: 15, userId})
  const newServiceRequests = getPendingServiceRequests(userId)
  const dashboadStats = getDashboardStats()

  return {
    implementationPlans,
    notifications,
    equipment,
    newServiceRequests,
    dashboadStats
  }
}

