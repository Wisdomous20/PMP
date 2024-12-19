"use client"

import { useState } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus";
import useGetServiceRequestList from "@/domains/service-request/hooks/useGetServiceRequestList";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import LoadingSpinner from "@/components/ui/loadingDots"
import { Card } from "@/components/ui/card";

export default function Page() {
  const [ serviceRequestIndex, setServiceRequestIndex ] = useState(0);
  const { serviceRequests, loading } = useGetServiceRequestList();
  const { userRole, loading: userRoleLoading } = useGetUserRole()

  if (loading || userRoleLoading) {
    return <LoadingSpinner />;
  }

  console.log(serviceRequests)

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <ServiceRequestList serviceRequests={serviceRequests} setServiceRequestIndex={setServiceRequestIndex}/>
      <div className="flex flex-col w-full">
        {serviceRequests.length === 0 ?
          <Card className="w-full h-screen flex flex-col"></Card>
          :
          userRole === "USER" ?
            <ServiceRequestStatus serviceRequest={serviceRequests[serviceRequestIndex]}/>
            :
            <ServiceRequestDetails serviceRequest={serviceRequests[serviceRequestIndex]}/>
          
        }
      </div>
    </div>
  );
}
