/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import ServiceRequestRating from "@/components/service-request/ServiceRequestRatings";
import { Skeleton } from "../ui/skeleton";

interface ServiceRequestStatusProps {
  serviceRequest: ServiceRequest;
}

function getStatusInfo(status: Status[], implementationPlanStatus: string): { message: string; progress: number[] } {
  const lastStatus = status[status.length - 1]?.status;

  switch (lastStatus) {
    case "completed":
      return {
        message: "Your request has been completed. Please answer our survey.",
        progress: [100, 100, 100],
      };
    case "approved":
      return {
        message: "Your request has been approved. An implementation plan is being created.",
        progress: [100, 0, 0],
      };
    case "in_progress":
      return {
        message: "Your request is in progress.",
        progress: [100, 100, 0],
      };
    case "rejected":
      return {
        message: "Your request has been rejected.",
        progress: [100, 0, 0],
      };
    default:
      return {
        message: "Your request is pending approval.",
        progress: [0, 0, 0],
      };
  }
}

export default function ServiceRequestStatus({ serviceRequest }: ServiceRequestStatusProps) {
  const { concern, details, createdOn, status, id } = serviceRequest;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [implementationPlanStatus, setImplementationPlanStatus] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { message, progress } = getStatusInfo(status, implementationPlanStatus);
  const isCompleted = status[status.length - 1]?.status === "completed";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch implementation plan status
        if (userId) {
          const implPlanResponse = await fetch(`/api/implementation-plan/${id}?userId=${userId}`);
          const implPlanData = await implPlanResponse.json();
          setImplementationPlanStatus(implPlanData.status);
        }

        // Fetch existing rating if request is completed
        if (isCompleted) {
          const ratingResponse = await fetch(`/api/service-request/${id}/rating`);
          if (ratingResponse.ok) {
            const ratingData = await ratingResponse.json();
            setExistingRating(ratingData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, id, isCompleted]);

  const handleRatingSubmit = () => {
    setIsRatingSubmitted(true);
    window.location.reload();
  };

  const renderRatingSection = () => {
    // Loading state
    if (isLoading && isCompleted) {
      return (
        <div className="text-center mt-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-center">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      );
    }

    // Existing rating
    if (existingRating) {
      return (
        <div className="text-center mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold text-green-700">Thank You for Your Feedback!</h3>
          <p className="text-green-600 mt-2">
            You have already rated this service request.
          </p>
        </div>
      );
    }

    // If no rating exists and request is completed
    if (isCompleted && !isRatingSubmitted && !isLoading) {
      return (
        <div className="text-center mt-4">
          <p className="text-lg text-muted-foreground">
            Thank you for your patience. Please rate the progress by pressing the button below.
          </p>
          <div className="flex justify-center mt-4">
            <ServiceRequestRating
              serviceRequestId={id}
              onSuccessfulSubmit={handleRatingSubmit}
            />
          </div>
        </div>
      );
    }

    // If rating is just submitted
    if (isRatingSubmitted) {
      return (
        <div className="text-center mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold text-green-700">Thank You!</h3>
          <p className="text-green-600 mt-2">
            Your feedback has been successfully submitted.
            We appreciate your time and input.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full h-screen flex flex-col p-6">
      <CardHeader>
        <h1 className="text-3xl font-semibold text-center">
          {isCompleted ? "Your service request is complete" : "Your Service Request has been created!"}
        </h1>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-lg text-muted-foreground">{message}</div>

        <div className="flex justify-between items-center gap-2">
          <Progress value={progress[0]} className="h-2 w-1/4" aria-label="Progress step 1" />
          <Progress value={progress[1]} className="h-2 w-1/4" aria-label="Progress step 2" />
          <Progress value={progress[2]} className="h-2 w-1/2" aria-label="Progress step 3" />
        </div>

        <Separator />
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-medium mb-2">{concern}</h2>
          <p className="text-sm text-muted-foreground ml-auto">Created: {formatTimestamp(createdOn as Date)}</p>
        </div>
        <Separator />
        <div className="prose max-w-none">
          <p>{details}</p>
        </div>

        {renderRatingSection()}
      </CardContent>
    </Card>
  );
}