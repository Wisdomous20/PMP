import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RejectServiceRequest from "./RejectServiceRequest";
import ApproveServiceRequest from "./ApproveServiceRequest";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import CreateImplementationPlan from "../implementation-plan/CreateImplementationPlanMyk";

interface ServiceRequestDetailsProps {
  serviceRequest: ServiceRequest
}

export default function ServiceRequestDetails({ serviceRequest }: ServiceRequestDetailsProps) {
  const {  id, concern, details, createdOn, requesterName } = serviceRequest;
  const { userRole } = useGetUserRole();
  const formattedDate = createdOn ? createdOn.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }) : 'Date not available';

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 id="title-of-request" className="text-2xl font-semibold text-indigo-text">
            {concern}
          </h1>
          {userRole === "ADMIN" &&
            <div className="flex space-x-2">
              <RejectServiceRequest serviceRequestId={id}/>
              <ApproveServiceRequest serviceRequestId={id}/>
            </div>
          }
          {userRole === "SUPERVISOR" &&
            <div className="flex space-x-2">
              <CreateImplementationPlan serviceRequest={serviceRequest}/>
            </div>
          }
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span id="requestor-name" data-testid="requestor-name">
              {requesterName}
            </span>
          </div>
          <time id="created-on" dateTime={formattedDate}>
            {formattedDate}
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
