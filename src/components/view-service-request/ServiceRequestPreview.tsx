import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  id: string,
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestPreview({ id, requesterName, title, details, createdOn }: ServiceRequestPreviewProps) {
  const detailsPreview = details.length > 50 ? details.slice(0, 50) + '...' : details;
  const formattedDate = formatTimestamp(createdOn);
  return (
    <Link href={`/service-request/${id}`}>
      <Card className="w-full p-2 px-4 hover:shadow-lg hover:bg-gray-100">
        <CardContent className="p-0 flex flex-row gap-2">
          <p className="text-base font-semibold w-1/4 ">{requesterName}</p>
          <div className="w-8/12">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{detailsPreview}</p>
          </div>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
