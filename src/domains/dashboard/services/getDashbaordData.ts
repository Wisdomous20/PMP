import getImplementationPlans from "@/domains/implementation-plan/services/getImplementationPlans";
import { getPaginatedEquipment } from "@/domains/inventory-management/services/getPaginatedEquipment";
import { fetchNotifications } from "@/domains/notification/services/fetchNotifications";
import { getPendingServiceRequests } from "@/domains/service-request/services/getPendingServiceRequests";
import { getDashboardStats } from "./getDashboardStats";

export async function getDashboardData(userId : string) {

  const implementationPlans = await getImplementationPlans(userId)
  const notifications = await fetchNotifications()
  const equipment = await getPaginatedEquipment({page: 1, pageSize: 15, userId})
  const newServiceRequests = await getPendingServiceRequests(userId)
  const dashboadStats = await getDashboardStats()

  return {
    implementationPlans,
    notifications,
    equipment,
    newServiceRequests,
    dashboadStats
  }
}

