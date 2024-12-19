import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RejectServiceRequest from "./RejectServiceRequest";
import ApproveServiceRequest from "./ApproveServiceRequest";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";
import CreateImplementationPlan from "../implementation-plan/CreateImplementationPlanMyk";
import formatTimestamp from "@/utils/formatTimestamp";

interface ServiceRequestDetailsProps {
  serviceRequest: ServiceRequest;
}


export default function ServiceRequestDetails({ serviceRequest }: ServiceRequestDetailsProps) {
  const { id, concern, details, createdOn, requesterName, status } = serviceRequest;
  const { userRole, loading: roleLoading } = useGetUserRole();
  const [loading, setLoading] = useState(true); // Initialize your loading state

  const currentStatus = status
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.status;

  
  useEffect(() => {
    if (!roleLoading) {
      setLoading(false);
    }
  }, [roleLoading]);

  if (loading) {
    return <Skeleton className="flex-grow" />;
  }

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 id="title-of-request" className="text-2xl font-semibold text-indigo-text">
            {concern}
          </h1>
          {userRole === "ADMIN" && (
            (currentStatus === "pending" ? 
              <div className="flex space-x-2">
                <RejectServiceRequest serviceRequestId={id} />
                <ApproveServiceRequest serviceRequestId={id} />
              </div>
              :
              currentStatus === "approved" && (
                <div className="flex space-x-2">
                <CreateImplementationPlan serviceRequest={serviceRequest} />
              </div>
              )
            )
          )}
          {(userRole === "SUPERVISOR" && currentStatus === "approved") && (
            <div className="flex space-x-2">
              <CreateImplementationPlan serviceRequest={serviceRequest} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span id="requestor-name" data-testid="requestor-name">
              {requesterName}
            </span>
            <span
              id="status-badge"
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                currentStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : currentStatus === "approved"
                  ? "bg-green-100 text-green-800"
                  : currentStatus === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <time id="created-on" dateTime={formatTimestamp(createdOn as Date)}>
            {formatTimestamp(createdOn as Date)}
          </time>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 flex-grow">
        <div id="request-details" className="prose max-w-none">
          <p>{details}</p>
        </div>
      </CardContent>
    </Card>
  );
}
