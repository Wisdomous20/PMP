import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RejectServiceRequest from "./RejectServiceRequest";
import ApproveServiceRequest from "./ApproveServiceRequest";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";

interface ServiceRequestDetailsProps {
  requestorName: string;
  concern: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestDetails({
  requestorName,
  concern,
  details,
  createdOn,
}: ServiceRequestDetailsProps) {
  const { userRole } = useGetUserRole();
  const formattedDate = new Date(createdOn).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 id="title-of-request" className="text-2xl font-semibold text-indigo-text">
            {concern}
          </h1>
          {userRole === "ADMIN" &&
            <div className="flex space-x-2">
              <RejectServiceRequest />
              <ApproveServiceRequest />
            </div>
          }
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span id="requestor-name" data-testid="requestor-name">
              {requestorName}
            </span>
          </div>
          <time id="created-on" dateTime={createdOn}>
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
