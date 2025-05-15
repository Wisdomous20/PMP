"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import fetchGetServiceRequestById from "@/domains/service-request/services/fetchGetServiceRequestById";

export default function ServiceRequestDetailsPage() {
  const params = useParams();
  const serviceRequestId = params.id as string;
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceRequestId) {
      const getDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchGetServiceRequestById(serviceRequestId);
          if (data) {
            setServiceRequest(data);
          } else {
            setError("Service request not found or an error occurred.");
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("Error fetching service request details:", err);
          setError(err.message || "Could not load service request. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      getDetails();
    }
  }, [serviceRequestId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading service request details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center p-4">
        <Card className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/service-requests">
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to all requests
            </button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!serviceRequest) {
    // This case should ideally be caught by `error` state from fetchServiceRequestDetails returning null
    // but acts as a fallback for robustness.
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center p-4">
        <Card className="p-6 text-center">
          <span className="text-gray-500">Service request not found.</span>
          <Link href="/service-requests">
            <button className="text-blue-600 hover:text-blue-800 mt-4 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to all requests
            </button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen h-full flex bg-gradient-to-b from-yellow-50 to-blue-50 py-12 px-4 justify-center">
      <div className="max-w-4xl w-full">
        <Link href="/service-requests" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to My Service Requests
        </Link>
        <ServiceRequestStatus serviceRequest={serviceRequest} />
      </div>
    </div>
  );
}