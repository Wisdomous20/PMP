"use client";

import { useState } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import UserServiceRequestList from "@/components/service-request/UserServiceRequestList";
import useGetServiceRequestList from "@/domains/service-request/hooks/useGetServiceRequestList";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const { serviceRequests, loading: srLoading } = useGetServiceRequestList();
  const { userRole, loading: roleLoading } = useGetUserRole();
  const loading = srLoading || roleLoading;

  console.log(serviceRequests)

  if (loading) {
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
              serviceRequests={serviceRequests}
              setServiceRequestIndex={setSelectedIndex}
              loading={srLoading}
            />
            <div className="flex-1">
              {serviceRequests.length === 0 ? (
                <Card className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No requests found</span>
                </Card>
              ) : (
                <ServiceRequestDetails
                  serviceRequest={serviceRequests[selectedIndex]}
                />
              )}
            </div>
          </>
        ) : (
          <UserServiceRequestList
            serviceRequests={serviceRequests}
            loading={srLoading}
          />
        )}
      </div>
    </div>
  );
}