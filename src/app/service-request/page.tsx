"use client";

import { useState } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import UserServiceRequestList from "@/components/service-request/UserServiceRequestList";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";
import fetchGetServiceRequest from "@/domains/service-request/services/fetchGetServiceRequest";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: session } = useSession();

  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => fetchUserRole(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const { data: serviceRequests, isLoading: srLoading } = useQuery({
    queryKey: ["ServiceRequests", session?.user.id],
    queryFn: () => fetchGetServiceRequest(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const filteredRequests : ServiceRequest[] = serviceRequests ? serviceRequests.filter(
    (request: ServiceRequest) => !request.status.some((status) => status.status === "archived")
  ) : []
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = a.createdOn ? new Date(a.createdOn) : null;
    const dateB = b.createdOn ? new Date(b.createdOn) : null;
    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;
    return dateB.getTime() - dateA.getTime();
  });

  if (srLoading || roleLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  const isAdmin = userRole !== "USER";

  return (
    <div className="w-full min-h-screen h-full flex bg-gradient-to-b from-yellow-50 to-blue-50">
      {isAdmin && <LeftTab />}
      <div className={isAdmin ? "flex-1 flex" : "w-full h-full"}>
        {isAdmin ? (
          <>
            <ServiceRequestList
              serviceRequests={sortedRequests}
              setServiceRequestIndex={setSelectedIndex}
              loading={srLoading}
            />
            <div className="flex-1">
              {(!serviceRequests || serviceRequests.length === 0) ? (
                <Card className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No requests found</span>
                </Card>
              ) : (
                <ServiceRequestDetails
                  serviceRequest={serviceRequests ? sortedRequests[selectedIndex] : undefined}
                />
              )}
            </div>
          </>
        ) : (
          <UserServiceRequestList
            serviceRequests={sortedRequests}
            loading={srLoading}
          />
        )}
      </div>
    </div>
  );
}