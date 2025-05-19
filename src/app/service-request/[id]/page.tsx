"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import fetchGetServiceRequestById from "@/domains/service-request/services/fetchGetServiceRequestById";
import LeftTab from "@/components/layouts/LeftTab";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";

export default function ServiceRequestDetailsPage() {
  const params = useParams();
  const serviceRequestId = params.id as string;
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession(); 

  const { data: userRole, isLoading : roleLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => fetchUserRole(session?.user.id as string),
    enabled: !!session?.user.id,
  });

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

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading service request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-8">
            <Card className="p-8">
              <div className="text-red-600 text-lg mb-4">{error}</div>
              <Link
                href="/service-requests"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to all requests
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-8">
            <Card className="p-8">
              <div className="text-gray-600 text-lg mb-4">Service request not found.</div>
              <Link
                href="/service-requests"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to all requests
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getBackLinkText = () => {
    if (userRole === "SUPERVISOR" || userRole === "ADMIN") {
      return "Back to all service requests";
    }
    return "Back to My Service Requests";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 flex flex-row">
      {userRole !== "USER" && <LeftTab />}
      <div className="max-w-6xl w-full mx-auto h-full px-4 py-8">
        <div className="mb-6">
          <Link
            href={"/service-request"}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            {getBackLinkText()}
          </Link>
        </div>
        
        {(userRole === "ADMIN" || userRole === "SUPERVISOR" || userRole === "SECRETARY") && (
          <ServiceRequestDetails serviceRequest={serviceRequest} />
        )}
        
        {userRole === "USER" && (
          <ServiceRequestStatus serviceRequest={serviceRequest} />
        )}
      </div>
    </div>
  );
}