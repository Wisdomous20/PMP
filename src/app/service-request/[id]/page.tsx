"use client"
import { useEffect, useState } from "react";
import LeftTab from "@/components/layouts/LeftTab";
import ServiceRequestDetails from "@/components/view-service-request/ServiceRequestDetails";
import getServiceRequestDetailsFetch from "@/utils/service-request/getServiceRequestByIdFetch";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getServiceRequestDetailsFetch(id);
        setServiceRequest(data);
      } catch (err) {
        setError("Failed to load service request details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!serviceRequest) {
    return <div>No service request details found.</div>;
  }

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="flex flex-col w-full">
        <ServiceRequestDetails
          requestorName={serviceRequest.requesterName}
          title={serviceRequest.title}
          details={serviceRequest.details}
          createdOn={serviceRequest.createdOn}
        />
      </div>
    </div>
  );
}
