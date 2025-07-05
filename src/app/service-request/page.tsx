"use client";

import { useState, useEffect } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import UserServiceRequestList from "@/components/service-request/UserServiceRequestList";
import { getUserRole } from "@/lib/user/get-user-role";
import { getServiceRequests } from "@/lib/service-request/fetch-service-request";
import { Skeleton } from "@/components/ui/skeleton";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Page() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => getUserRole(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const {
    data: serviceRequests,
    isLoading: srLoading,
  } = useQuery({
    queryKey: ["ServiceRequests", session?.user.id],
    queryFn: () => getServiceRequests(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    setIsLoading(roleLoading || srLoading && !(userRole || serviceRequests))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleLoading, srLoading])

  const isUser = userRole === "USER";

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="flex-1 p-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-8 w-1/5 rounded-full" />
          </div>
          {/* Search & Tabs */}
          <div className="space-y-4 mb-6">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-8 w-1/2 rounded-full" />
          </div>
          {/* List items */}
          <Skeleton className="space-y-4 p-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            ))}
          </Skeleton>
        </div>
      </div>
    );
  }

  const sortedRequests = serviceRequests
    ? [...serviceRequests.data!].sort((a, b) => {
      const dateA = a.createdOn ? new Date(a.createdOn) : null;
      const dateB = b.createdOn ? new Date(b.createdOn) : null;
      if (dateA === null && dateB === null) return 0;
      if (dateA === null) return 1;
      if (dateB === null) return -1;
      return dateB.getTime() - dateA.getTime();
    })
    : [];

  const filteredBySearch = sortedRequests.filter((request) =>
    request.concern.toLowerCase().includes(search.toLowerCase()) ||
    request.requesterName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests: ServiceRequest[] = filteredBySearch.filter(
    (request: ServiceRequest) =>
      !request.status.some((status) => status.status === "archived")
  );

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-yellow-50 to-blue-50">
      {!isUser && <LeftTab />}
      <div className={isUser ? "w-full" : "flex-1 flex"}>
        {isUser ? (
          <UserServiceRequestList serviceRequests={sortedRequests} loading={srLoading} />
        ) : (
          <>
            <ServiceRequestList
              serviceRequests={filteredRequests}
              setServiceRequestIndex={setSelectedIndex}
              loading={srLoading}
              search={search}
              setSearch={setSearch}
            />
            <div className="flex-1">
              {filteredRequests.length === 0 ? (
                <Card className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No requests found</span>
                </Card>
              ) : (
                <ServiceRequestDetails serviceRequest={filteredRequests[selectedIndex]} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
