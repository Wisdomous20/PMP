import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ServiceRequestStatusProps {
  serviceRequest: ServiceRequest
}

function getStatusInfo(status: Status[]): { message: string; progress: number[] } {
  const lastStatus = status[status.length - 1]?.status;

  switch (lastStatus) {
    case "approved":
      return {
        message: "Your request has been approved. An implementation plan is being created.",
        progress: [100, 0, 0]
      };
    case "in_progress":
      return {
        message: "Your request is in progress.",
        progress: [100, 100, 0]
      };
    case "rejected":
      return {
        message: "Your request has been rejected.",
        progress: [100, 0, 0]
      };
    default:
      return {
        message: "Your request is pending approval.",
        progress: [0, 0, 0]
      };
  }
}

export default function ServiceRequestStatus({ serviceRequest }: ServiceRequestStatusProps) {
  const {  concern, details, createdOn, status } = serviceRequest;
  const { message, progress } = getStatusInfo(status);
  const formattedDate = createdOn ? createdOn.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }) : 'Date not available';

  return (
    <Card className="w-full h-screen flex flex-col p-6">
        <CardHeader>
          <h1 className="text-3xl font-semibold text-center">Your Service Request has been created!</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-lg text-muted-foreground">{message}</div>
          <div className="flex justify-between items-center gap-2">
            <Progress 
              value={progress[0]} 
              className="h-2 w-1/4"
              aria-label="Progress step 1"
              style={{ backgroundColor: status[status.length - 1]?.status === "rejected" ? "red" : undefined }}
            />
            <Progress 
              value={progress[1]} 
              className="h-2 w-1/4"
              aria-label="Progress step 2"
            />
            <Progress 
              value={progress[2]} 
              className="h-2 w-1/2"
              aria-label="Progress step 3"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-medium mb-2">{concern}</h2>
            <p className="text-sm text-muted-foreground ml-auto">Created on: {formattedDate}</p>
          </div>
          <Separator />
          <div className="prose max-w-none">
            <p>{details}</p>
          </div>
        </CardContent>
    </Card>
  )
}

