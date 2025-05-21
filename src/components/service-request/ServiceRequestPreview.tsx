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
  const concernPreview = concern.length > 50 ? concern.slice(0, 50) + "..." : concern;
  const requesterNamePreview = requesterName.length > 50 ? requesterName.slice(0, 50) + "..." : requesterName;
  const currentStatus = status
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.status;
  return (
    <Card
      className="p-4 rounded-none shadow-sm transition duration-200 ease-in-out hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={() => setServiceRequestIndex(index)}
    >
      <CardContent className="p-0 space-y-2">
        <div className="flex justify-between items-start">
          <div className="">
            <h2 className=" pb-1 pl-2 text-sm font-semibold text-indigo-950 dark:text-gray-100">
              {requesterNamePreview}
            </h2>
            <div className="space-y-0 pl-2">
              <p className="text-md font-medium text-indigo-dark dark:text-gray-100 pb-0.2">{concernPreview}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{detailsPreview}</p>
            </div>
          </div>
          <span className="text-sm font-md w-20 text-right text-muted-foreground dark:text-gray-400">
            {formatTimestamp(createdOn as Date)}
          </span>
        </div>
        <div className="pt-2">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
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
      </CardContent>
    </Card>
  );
}