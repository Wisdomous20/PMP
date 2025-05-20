/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import fetchGetImplementationPlanByServiceRequestId from "@/domains/implementation-plan/services/fetchGetImplementationPlanByServiceRequestId";

interface ServiceRequestDetailsModalProps {
  request: any;
  onClose: () => void;
}

export default function ArchiveDetailsModal({
  request,
  onClose,
}: ServiceRequestDetailsModalProps) {
  const [implementationPlan, setImplementationPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!request?.id) return;

    async function fetchImplementationPlan() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchGetImplementationPlanByServiceRequestId(
          request.id
        );
        setImplementationPlan(data);
      } catch (err) {
        console.error("Error fetching implementation plan:", err);
        setError("Failed to load implementation plan.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImplementationPlan();
  }, [request?.id]);

  if (!request) return null;

  if (isLoading) {
    return <div>Loading implementation plan...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tasks = implementationPlan?.tasks || [];

  console.log("FULL REQUEST DATA:", JSON.stringify(request, null, 2));
  console.log("TASK DATA:", request.Task);
  console.log("PERSONNEL DATA:", request.Personnel);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{request.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Requestor</p>
            <p className="font-medium">{request.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Request Date</p>
            <p className="font-medium">
              {request.requestDate
                ? format(new Date(request.requestDate), "MMM d, yyyy")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{request.department || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-green-600">Completed</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Concern</p>
          <p className="p-3 bg-gray-50 rounded-md">
            {request.title || "No concern specified"}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Details</p>
          <div className="p-3 bg-gray-50 rounded-md">
            <p>{request.details || "No details provided"}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Tasks</p>
          {tasks.length > 0 ? (
            <ul className="list-disc pl-5 space-y-4">
              {tasks.map((task: any) => (
                <li key={task.id} className="text-sm">
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(task.startTime), "MMM d, yyyy h:mm a")} –{" "}
                    {format(new Date(task.endTime), "MMM d, yyyy h:mm a")}
                  </p>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">Assigned Personnel:</span>{" "}
                    {task.personnel && task.personnel.length > 0 ? (
                      task.personnel.map((person: any, index: number) => (
                        <span key={person.id}>
                          {person.name}
                          {index < task.personnel.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-gray-400">
                        No personnel assigned
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-500 italic">
              No tasks were added to this request.
            </div>
          )}
        </div>

        {/* Show general assigned personnel */}
        {request.Personnel && request.Personnel.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">All Assigned Personnel</p>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              {request.Personnel.map((person: any, index: number) => (
                <span key={person.id}>
                  {person.name}
                  {index < request.Personnel.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {request.ServiceRequestRating && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Rating</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{request.ServiceRequestRating.ratings}/5</span>
            </div>
          </div>
        )}
        {request.ServiceRequestRating?.questions &&
          request.ServiceRequestRating.questions.some((q: any) => q.answer) && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">
                Rating Questions & Answers
              </p>
              <div className="p-3 bg-gray-50 rounded-md space-y-2">
                {request.ServiceRequestRating.questions
                  .filter((q: any) => q.answer)
                  .map((q: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <div className="font-medium text-gray-700">
                        {q.question}
                      </div>
                      <div className="text-gray-800 ml-2">{q.answer}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {request.ServiceRequestRating?.description && (
          <div className="mb-2">
            <p className="text-sm text-gray-500 mb-1">Rating Details</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <span>{request.ServiceRequestRating.description}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
