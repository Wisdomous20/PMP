import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";

interface ServiceRequestPreviewProps {
  index: number;
  serviceRequest: ServiceRequest;
  setServiceRequestIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function ServiceRequestPreview({
  serviceRequest,
  setServiceRequestIndex,
  index,
}: ServiceRequestPreviewProps) {
  const { concern, details, createdOn, requesterName, status } = serviceRequest;

  const detailsPreview = details.length > 50 ? details.slice(0, 50) + "..." : details;

  const currentStatus = status
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.status;

  return (
    <Card
      className="rounded-md transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => setServiceRequestIndex(index)}
    >
      <CardContent className="flex justify-between items-center p-4">
        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            <h2 className="pb-1 font-semibold text-indigo-text">{requesterName}</h2>
            <span className="hidden sm:block text-sm text-gray-text">
              {formatTimestamp(createdOn as Date)}
            </span>
          </div>
          <p className="text-sm text-gray-text3">{concern}</p>
          <p className="text-sm text-gray-text2">{detailsPreview}</p>
          <div className="mt-2">
            {/* Display the current status */}
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
        </div>
      </CardContent>
    </Card>
  );
}
