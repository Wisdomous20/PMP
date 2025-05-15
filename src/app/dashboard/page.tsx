"use client"

import LeftTab from "@/components/layouts/LeftTab";
import CreateServiceRequest from "@/components/service-request/CreateServiceRequest";
import Dashboard from "@/components/dashboard/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: session } = useSession(); // Get session data from next-auth

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => fetchUserRole(session?.user.id as string),
    enabled: !!session?.user.id, // Only fetch if user ID exists
  });

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      {isLoading ? (
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        userRole === "ADMIN" || userRole === "SUPERVISOR" || userRole === "SECRETARY" ? <Dashboard /> : <CreateServiceRequest />
      )}
    </div>
  );
}
