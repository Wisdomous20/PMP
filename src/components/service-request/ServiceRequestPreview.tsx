import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  id: string;
  requesterName: string;
  concern: string;
  details: string;
  createdOn: Date | null;
}

export default function ServiceRequestPreview({ id, requesterName, concern, details, createdOn }: ServiceRequestPreviewProps) {
  const detailsPreview = details.length > 50 ? details.slice(0, 50) + '...' : details;
  return (

    <Link href={`/service-request/${id}`}>
      <Card key={id} className="rounded-md transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 ">
        <CardContent className="flex justify-between items-center p-4">
          <div className="w-full">
            <div className="flex flex-row justify-between items-center">
              <h2 className="pb-1 font-semibold text-indigo-text">{requesterName}</h2>
              <span className="hidden sm:block text-sm text-gray-text">{formatTimestamp(createdOn)}</span>
            </div>
            <p className="text-sm  text-gray-text3">{concern}</p>
            <p className="text-sm text-gray-text2">{detailsPreview}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
