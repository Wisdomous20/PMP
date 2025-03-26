"use client"

import { useState } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus";
import useGetServiceRequestList from "@/domains/service-request/hooks/useGetServiceRequestList";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [serviceRequestIndex, setServiceRequestIndex] = useState(0);
  const { serviceRequests, loading } = useGetServiceRequestList();
  const { userRole, loading: userRoleLoading } = useGetUserRole()

  //   return (
  //     <div className="w-screen h-screen flex overflow-x-hidden">
  //       <div className="w-20 flex-shrink-0">
  //       <LeftTab />
  //       </div>
  //       <ServiceRequestList serviceRequests={serviceRequests} setServiceRequestIndex={setServiceRequestIndex} loading={loading || userRoleLoading}/>
  //       <div className="flex flex-col w-full">
  //         {serviceRequests.length === 0 ?
  //           <Card className="w-full h-screen flex flex-col"></Card>
  //           :
  //           userRole === "USER" ?
  //             <ServiceRequestStatus serviceRequest={serviceRequests[serviceRequestIndex]}/>
  //             :
  //             <ServiceRequestDetails serviceRequest={serviceRequests[serviceRequestIndex]}/>
  //         }
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="w-screen h-screen flex flex-row">
      <LeftTab />

      <div className="flex-1 flex flex-row">
        <ServiceRequestList
          serviceRequests={serviceRequests}
          setServiceRequestIndex={setServiceRequestIndex}
          loading={loading || userRoleLoading}
        />
        <div className="flex flex-col w-full">
          {serviceRequests.length === 0 ? (
            <Card className="w-full h-screen flex flex-col"></Card>
          ) : userRole === "USER" ? (
            <ServiceRequestStatus serviceRequest={serviceRequests[serviceRequestIndex]} />
          ) : (
            <ServiceRequestDetails serviceRequest={serviceRequests[serviceRequestIndex]} />
          )}
        </div>
      </div>
    </div>
  );
}