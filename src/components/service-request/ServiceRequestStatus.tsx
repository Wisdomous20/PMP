/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import formatTimestamp from "@/utils/formatTimestamp";
import ServiceRequestRating from "@/components/service-request/ServiceRequestRatings";
import { getImplementationPlanByServiceRequestId } from "@/lib/implementation-plan/get-implementation-plan";
import { Skeleton } from "../ui/skeleton";
import { fetchAddArchivedStatus } from "@/domains/service-request/services/status/fetchAddSatus";

interface ServiceRequestStatusProps {
  serviceRequest: ServiceRequest;
}

function getStatusInfo(
  status: Status[],

  implementationPlan: any = null
): { message: string; progress: number[] } {
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
      let taskProgress = 0;
      if (implementationPlan && implementationPlan.tasks && implementationPlan.tasks.length > 0) {
        const completedTasks = implementationPlan.tasks.filter((task: { checked: boolean; }) => task.checked).length;
        taskProgress = (completedTasks / implementationPlan.tasks.length) * 100;
      }
      
      return {
        message: "Your request is in progress.",
        progress: [100, 100, taskProgress],
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

export default function ServiceRequestStatus({
  serviceRequest,
}: ServiceRequestStatusProps) {
  const { concern, details, createdOn, status, id } = serviceRequest;
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [implPlanData, setImplPlanData] = useState<any>(null);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { message, progress } = getStatusInfo(status, implPlanData);
  const isCompleted = status[status.length - 1]?.status === "completed";
  const isInProgress = status[status.length - 1]?.status === "in_progress";
  const archiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasArchivedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (userId && (isInProgress || isCompleted)) {
          const data = await getImplementationPlanByServiceRequestId(id)
          setImplPlanData(data);
        }

        if (isCompleted) {
          const ratingResponse = await fetch(
            `/api/service-request/rating/${id}`
          );
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
  }, [userId, id, isCompleted, isInProgress]);

  const archiveServiceRequest = async () => {
    if (hasArchivedRef.current) return;

    try {
      hasArchivedRef.current = true;
      await fetchAddArchivedStatus(id);
    } catch (error) {
      console.error("Failed to archive service request:", error);
      hasArchivedRef.current = false;
    }
  };

  useEffect(() => {
    if (isRatingSubmitted) {
      const handleBeforeUnload = () => {
        sessionStorage.setItem("archiveServiceRequest", id);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      archiveTimeoutRef.current = setTimeout(async () => {
        await archiveServiceRequest();
      }, 500);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (archiveTimeoutRef.current) {
          clearTimeout(archiveTimeoutRef.current);
        }

        if (isRatingSubmitted && !hasArchivedRef.current) {
          archiveServiceRequest();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRatingSubmitted, id]);

  useEffect(() => {
    const pendingArchiveId = sessionStorage.getItem("archiveServiceRequest");
    if (pendingArchiveId === id) {
      archiveServiceRequest().then(() => {
        sessionStorage.removeItem("archiveServiceRequest");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRatingSubmit = async () => {
    setIsRatingSubmitted(true);
  };

  const renderTaskList = () => {
    if (!implPlanData || !implPlanData.tasks || implPlanData.tasks.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Implementation Tasks</h3>
        <ul className="list-disc pl-5 space-y-4">
          {implPlanData.tasks.map((task: any) => (
            <li key={task.id} className="text-sm">
              <div className="flex items-center gap-2">
                <p className={`font-medium ${task.checked ? "line-through text-gray-500" : ""}`}>
                  {task.name}
                </p>
                <span className={`${task.checked ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} px-2 py-0.5 rounded-full text-xs font-medium ml-2`}>
                  {task.checked ? "Completed" : "Pending"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {format(new Date(task.startTime), "MMM d, yyyy h:mm a")} –{" "}
                {format(new Date(task.endTime), "MMM d, yyyy h:mm a")}
              </p>
            </li>
          ))}
        </ul>
        
        {isInProgress && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <p className="text-sm text-gray-600">
              Progress: {implPlanData.tasks.filter((task: any) => task.checked).length} of {implPlanData.tasks.length} tasks completed
            </p>
          </div>
        )}
      </div>
    );
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
          <h3 className="text-xl font-semibold text-green-700">
            Thank You for Your Feedback!
          </h3>
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
            Thank you for your patience. Please rate the progress by pressing
            the button below.
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
            Your feedback has been successfully submitted. We appreciate your
            time and input.
          </p>
          <p className="text-green-500 mt-1 text-sm">
            This request will be archived automatically in a few seconds.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full h-full min-h-[80vh] flex flex-col p-6">
      <CardHeader>
        <h1 className="text-3xl font-semibold text-center">
          {isCompleted
            ? "Your service request is complete"
            : "Your Service Request has been created!"}
        </h1>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-lg text-muted-foreground">
          {message}
        </div>

        <div className="flex justify-between items-center gap-2">
          <Progress
            value={progress[0]}
            className="h-2 w-1/4"
            aria-label="Progress step 1"
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
          <p className="text-sm text-muted-foreground ml-auto">
            Created: {formatTimestamp(createdOn as Date)}
          </p>
        </div>
        <Separator />
        <div className="prose max-w-none">
          <p>{details}</p>
        </div>

        {(isInProgress || isCompleted) && renderTaskList()}
        
        {isLoading && (isInProgress || isCompleted) && (
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {renderRatingSection()}
      </CardContent>
    </Card>
  );
}