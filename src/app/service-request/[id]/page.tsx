"use client";

import {Card} from "@/components/ui/card";
import {ChevronLeft} from "lucide-react";
import {ErrorCodes} from "@/lib/ErrorCodes";
import LeftTab from "@/components/layouts/LeftTab";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";
import * as serviceRequestManager from "@/lib/service-requests/get-service-request";
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus";
import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";

export default function ServiceRequestDetailsPage() {
  const params = useParams();
  const serviceRequestId = params.id as string;
  const [userRole, setUserRole] = useState<string>("");
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    // Set the user role
    if (session && session.data) {
      setUserRole(session.data.user.role);
    }
  }, [session]);

  useEffect(() => {
    // Do not do anything if the request id is empty.
    if (!serviceRequestId) return;

    // Unset other stuff
    setError(null);

    if (session && session.data) {
      setLoading(true);
      serviceRequestManager.getServiceRequestById(serviceRequestId)
        .then(d => {
          if (d.code !== ErrorCodes.OK || !d.data) {
            setError(d.message as string);
            return;
          }

          setServiceRequest(d.data);
        })
        .finally(() => setLoading(false));
    }
  }, [serviceRequestId, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <Card className="p-6 space-y-4 h-[80vh]">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <Link
              href="/service-requests"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to all requests
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-gray-600 text-lg mb-4">Service request not found.</div>
            <Link
              href="/service-requests"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to all requests
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const getBackLinkText = () =>
    userRole === "SUPERVISOR" || userRole === "ADMIN"
      ? "Back to all service requests"
      : "Back to My Service Requests";

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50 flex flex-row">
      {userRole !== "USER" && <LeftTab />}
      <div className="max-w-6xl w-full mx-auto h-full px-4 py-8">
        <div className="mb-6">
          <Link
            href="/service-request"
            className="inline-flex items-center text-blue-600 hover:underline text-lg font-medium"
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
