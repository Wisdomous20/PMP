import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import ImplementationPlansInProgress from "../implementation-plan/ImplementationPlansInProgress";
import RecentInventoryLogs from "../inventory-management/RecentInventoryLogs";
import NotificationsPanel from "../notifications/RecentNotifications";
import NewServiceRequests from "../service-request/NewServiceRequests";
import { fetchDashboardData } from "@/domains/dashboard/services/fetchDashboardData";

export default function Dashboard() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchDashboardData(session.user.id);
        setDashboardData(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [session?.user?.id]);

  return (
    <div className="flex flex-col w-full min-h-screen p-8 overflow-y-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Monitor implementation plans, service requests, and equipment logs</p>
        </div>
      </div>
      
      <DashboardStats stats={dashboardData?.dashboardStats} isLoading={isLoading} error={error}/>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mt-6">
        <div className="lg:col-span-3 space-y-6">
          <ImplementationPlansInProgress implementationPlans={dashboardData?.implementationPlans} isLoading={isLoading} error={error}/>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <NewServiceRequests newServiceRequests={dashboardData?.newServiceRequests} isLoading={isLoading} error={error}/>
            <RecentInventoryLogs equipment={dashboardData?.equipment} isLoading={isLoading} error={error}/>
          </div>
        </div>

        <NotificationsPanel notifications={dashboardData?.notifications} isLoading={isLoading} error={error}/>
      </div>
    </div>
  );
}