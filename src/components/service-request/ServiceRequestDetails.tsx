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
  serviceRequest?: ServiceRequest;
}

export default function ServiceRequestDetails({ serviceRequest }: ServiceRequestDetailsProps) {
  const { userRole, loading: roleLoading } = useGetUserRole();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!roleLoading && serviceRequest) {
      setLoading(false);
    }
  }, [roleLoading, serviceRequest]);

  if (loading || !serviceRequest) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-14 w-20" />
              <Skeleton className="h-14 w-20" />
              <Skeleton className="h-14 w-20" />
            </div>
            <Separator />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { id, concern, details, createdOn, requesterName, status } = serviceRequest;
  
  const currentStatus = status
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.status;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{concern}</h2>
          </div>
          
          {userRole === "ADMIN" && (
            currentStatus === "pending" ? (
              <div className="flex gap-2">
                <RejectServiceRequest serviceRequestId={id} />
                <ApproveServiceRequest serviceRequestId={id} />
              </div>
            ) : currentStatus === "approved" && (
              <div>
                <CreateImplementationPlan serviceRequest={serviceRequest} />
              </div>
            )
          )}
          
          {userRole === "SUPERVISOR" && currentStatus === "approved" && (
            <div>
              <CreateImplementationPlan serviceRequest={serviceRequest} />
            </div>
          )}
        
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Requester</p>
              <p className="font-medium">{requesterName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                currentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                currentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                currentStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">{formatTimestamp(createdOn as Date)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Details</p>
            <p className="text-gray-800">{details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}