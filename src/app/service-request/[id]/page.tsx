"use client"
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestDetails from "@/components/view-service-request/ServiceRequestDetails";
import useGetServiceRequestDetails from "@/hooks/useGetServiceRequestDetails";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const { serviceRequestDetails, error, loading } = useGetServiceRequestDetails(id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!serviceRequestDetails) {
    return <div>No service request details found.</div>;
  }

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="flex flex-col w-full">
        <ServiceRequestDetails
          requestorName={serviceRequestDetails.requesterName}
          title={serviceRequestDetails.title}
          details={serviceRequestDetails.details}
          createdOn={serviceRequestDetails.createdOn}
        />
      </div>
    </div>
  );
}
