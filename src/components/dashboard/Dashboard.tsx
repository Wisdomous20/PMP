"use client";

import {useSession} from "next-auth/react";
import DashboardStats from "./DashboardStats";
import ImplementationPlansInProgress from "../implementation-plan/ImplementationPlansInProgress";
import RecentInventoryLogs from "../inventory-management/RecentInventoryLogs";
import NotificationsPanel from "../notifications/RecentNotifications";
import NewServiceRequests from "../service-request/NewServiceRequests";
import {DashboardDataResult, getDashboardData} from "@/lib/dashboard/dashboard-data";
import {useEffect, useState} from "react";
import {ErrorCodes} from "@/lib/ErrorCodes";

type DashboardState = DashboardDataResult["data"];

export default function Dashboard() {
  const session = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardState | null >(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);

    if (session.data?.user && session.data.user.id) {
      async function fetchDashboardData() {
        const data = await getDashboardData(session.data!.user.id);
        if (data.code !== ErrorCodes.OK) {
          return null;
        }

        return data.data;
      }

      fetchDashboardData().then(r => {
        if (r === null) {
          setError("Failed to fetch dashboard data. Please try again.");
          setIsLoading(false);
          return;
        }

        setDashboardData(r);
        setIsLoading(false);
      })
    }
  }, [session, shouldRefetch]);

  if (dashboardData === null) {
    return (<></>)
  }

  const handlePlansUpdate = async () => {
    setShouldRefetch(l => l + 1);
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-8 overflow-y-auto bg-gradient-to-b from-yellow-50 to-blue-100">
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
        ({dashboardData?.dashboardStats && (
          <DashboardStats
            stats={dashboardData?.dashboardStats}
            isLoading={isLoading}
            error={error}
          />
        )})
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ImplementationPlansInProgress
              onUpdate={handlePlansUpdate}
              implementationPlans={dashboardData!.implementationPlans.map(plan => ({
                id: plan.id,
                description: plan.description,
                status: plan.status,
                serviceRequest: {
                  ...plan.serviceRequest,
                  requesterName: plan.requesterName,
                  createdOn: plan.createdOn,
                },
                tasks: plan.tasks,
                createdAt: plan.createdAt,
              }))}
              isLoading={isLoading}
              error={error}
              userRole={session.data!.user.role as UserRole}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <NewServiceRequests
                newServiceRequests={dashboardData!.newServiceRequests?.slice(0, 5)}
                isLoading={isLoading}
                error={error}
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <RecentInventoryLogs
                equipment={dashboardData!.equipment?.slice(0, 6)}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden h-full">
          <NotificationsPanel
            notifications={dashboardData!.notifications.slice(0, 8)}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
