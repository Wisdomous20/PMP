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

  const {
    data: dashboardData,
    isLoading,
    error: dashboardError,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData", session?.user.id],
    queryFn: () => fetchDashboardData(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const handlePlansUpdate = async () => {
    await refetch();
  };

  const errorMessage =
    dashboardError instanceof Error ? dashboardError.message : null;

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-8 overflow-y-auto">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl text-indigo-dark font-bold tracking-tight mb-3">
            Operations Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor implementation plans, service requests, and equipment logs
          </p>
        </div>
      </div>
      <div className="mb-6">
        <DashboardStats
          stats={dashboardData?.dashboardStats}
          isLoading={isLoading || userRoleLoading}
          error={errorMessage}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ImplementationPlansInProgress
              onUpdate={handlePlansUpdate}
              implementationPlans={dashboardData?.implementationPlans}
              isLoading={isLoading || userRoleLoading}
              error={errorMessage}
              userRole={userRole as UserRole}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <NewServiceRequests
                newServiceRequests={dashboardData?.newServiceRequests?.slice(0,5)}
                isLoading={isLoading || userRoleLoading}
                error={errorMessage}
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <RecentInventoryLogs
                equipment={dashboardData?.equipment?.slice(0,6)}
                isLoading={isLoading || userRoleLoading}
                error={errorMessage}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden h-full">
          <NotificationsPanel
            notifications={dashboardData?.notifications?.slice(0, 8)}
            isLoading={isLoading || userRoleLoading}
            error={errorMessage}
          />
        </div>
      </div>
    </div>
  );
}
