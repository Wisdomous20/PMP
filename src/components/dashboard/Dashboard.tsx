import { useSession } from "next-auth/react";
import DashboardStats from "./DashboardStats";
import ImplementationPlansInProgress from "../implementation-plan/ImplementationPlansInProgress";
import RecentInventoryLogs from "../inventory-management/RecentInventoryLogs";
import NotificationsPanel from "../notifications/RecentNotifications";
import NewServiceRequests from "../service-request/NewServiceRequests";
import { fetchDashboardData } from "@/domains/dashboard/services/fetchDashboardData";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: session } = useSession();

  const { data: userRole, isLoading: userRoleLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => fetchUserRole(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const { data: dashboardData, isLoading, error: dashboardError, refetch } = useQuery({
    queryKey: ["dashboardData", session?.user.id],
    queryFn: () => fetchDashboardData(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const handlePlansUpdate = async () => {
    await refetch();
  };

  const errorMessage = dashboardError instanceof Error ? dashboardError.message : null;

  return (
    <div className="flex flex-col w-full min-h-screen p-8 overflow-y-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Monitor implementation plans, service requests, and equipment logs</p>
        </div>
      </div>

      <DashboardStats stats={dashboardData?.dashboardStats} isLoading={isLoading || userRoleLoading} error={errorMessage} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 py-6 max-h-[900px]">
        <div className="lg:col-span-3 space-y-6">
          <div className="overflow-y-scroll">
            <ImplementationPlansInProgress onUpdate={handlePlansUpdate} implementationPlans={dashboardData?.implementationPlans} isLoading={isLoading || userRoleLoading} error={errorMessage} userRole={userRole as UserRole} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="overflow-y-scroll">
              <NewServiceRequests newServiceRequests={dashboardData?.newServiceRequests} isLoading={isLoading || userRoleLoading} error={errorMessage} />
            </div>
            <div className="overflow-y-scroll">
              <RecentInventoryLogs equipment={dashboardData?.equipment} isLoading={isLoading || userRoleLoading} error={errorMessage} />
            </div>
          </div>
        </div>

        <div className="overflow-y-scroll">
          <NotificationsPanel notifications={dashboardData?.notifications} isLoading={isLoading || userRoleLoading} error={errorMessage} />
        </div>
      </div>
    </div>
  );
}