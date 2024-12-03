"use client"
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestList from "@/components/service-request/ServiceRequestList";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import useGetServiceRequestDetails from "@/domains/service-request/hooks/useGetServiceRequestDetails";
import LoadingSpinner from "@/components/ui/loadingDots"

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const { serviceRequestDetails, error, loading } = useGetServiceRequestDetails(id);

  if (loading) {
    return <LoadingSpinner />;
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
      <ServiceRequestList />
      <div className="flex flex-col w-full">
        <ServiceRequestDetails
          requestorName={serviceRequestDetails.requesterName}
          concern={serviceRequestDetails.concern}
          details={serviceRequestDetails.details}
          createdOn={serviceRequestDetails.createdOn}
        />
      </div>
    </div>
  );
}
