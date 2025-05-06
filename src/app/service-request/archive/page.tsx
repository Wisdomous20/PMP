"use client";

import LeftTab from "@/components/layouts/LeftTab";
import Archives from "@/components/service-request/Archives";

export default function Page() {

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
      <Archives />

      {/* <div className="flex-1 flex flex-row">
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
      </div> */}
    </div>
  );
}
