import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface ServiceRequestDetailsModalProps {
  request: any;
  onClose: () => void;
}

export default function ArchiveDetailsModal({
  request,
  onClose,
}: ServiceRequestDetailsModalProps) {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
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

        {request.ServiceRequestRating && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Rating</p>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <span className=" mr-2">
                {request.ServiceRequestRating.ratings}/5
              </span>
            </div>
          </div>
        )}

        {request.ServiceRequestRating && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Rating Details</p>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <span>{request.ServiceRequestRating.description}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
