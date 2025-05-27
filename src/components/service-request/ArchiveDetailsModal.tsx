"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  FileText,
  ListChecks,
  Users,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

  const tasks = implementationPlan?.tasks || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <Card className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b relative">
          <h2 className="text-xl font-bold">{request.title}</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 rounded-full p-1.5 transition-colors"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              <p>Error: {error}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <Badge className="bg-emerald-500 px-3 py-1 text-white">
                  <CheckCircle size={14} className="mr-1" />
                  Completed
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <User className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Requestor
                    </p>
                    <p className="font-medium">{request.name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Request Date
                    </p>
                    <p className="font-medium">
                      {request.requestDate
                        ? format(new Date(request.requestDate), "MMMM d, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Briefcase className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Department
                    </p>
                    <p className="font-medium">{request.department || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-500 font-medium">Concern</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p>{request.title || "No concern specified"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-500 font-medium">Details</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p>{request.details || "No details provided"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ListChecks className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-500 font-medium">Tasks</p>
                </div>

                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="font-medium">{task.name}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {format(
                              new Date(task.startTime),
                              "MMM d, yyyy h:mm a"
                            )}{" "}
                            –{" "}
                            {format(
                              new Date(task.endTime),
                              "MMM d, yyyy h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500 italic">
                    No tasks were added to this request.
                  </div>
                )}
              </div>

              {request.Personnel && request.Personnel.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="text-gray-400" size={18} />
                    <p className="text-sm text-gray-500 font-medium">
                      Assigned Personnel
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {request.Personnel.map((person: any) => (
                        <Badge
                          key={person.id}
                          variant="outline"
                          className="bg-white"
                        >
                          {person.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {request.ServiceRequestRating && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="text-gray-400" size={18} />
                    <p className="text-sm text-gray-500 font-medium">
                      Rating & Feedback
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < request.ServiceRequestRating.ratings
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">
                        {request.ServiceRequestRating.ratings}/5
                      </span>
                    </div>

                    {request.ServiceRequestRating.description && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          {request.ServiceRequestRating.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.ServiceRequestRating?.questions &&
                    request.ServiceRequestRating.questions.some(
                      (q: any) => q.answer
                    ) && (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                        {request.ServiceRequestRating.questions
                          .filter((q: any) => q.answer)
                          .map((q: any, idx: number) => (
                            <div key={idx}>
                              <p className="font-medium text-gray-700">
                                {q.question}
                              </p>
                              <p className="mt-1 text-gray-600">{q.answer}</p>
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
