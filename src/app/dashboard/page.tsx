"use client"

import LeftTab from "@/components/layouts/LeftTab";
import CreateServiceRequest from "@/components/service-request/CreateServiceRequest";
import Dashboard from "@/components/dashboard/Dashboard";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { userRole, loading } = useGetUserRole();

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      {loading ? (
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        userRole === "ADMIN" ||  userRole === "SUPERVISOR" || userRole === "SECRETARY" ? <Dashboard /> : <CreateServiceRequest />
      )}
    </div>
  );
}
