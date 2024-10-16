import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestPreview({ requesterName, title, details, createdOn }: ServiceRequestPreviewProps) {
  const detailsPreview = details.length > 50 ? details.slice(0, 50) + '...' : details;

  return (
    <Link href={"/service-request/1"}> {/* Replace with actual link to service request by its id */}
      <Card className="w-full p-2 px-8 hover:shadow-lg hover:bg-gray-100">
        <CardContent className="p-0 flex flex-row">
          <p className="text-base font-semibold w-1/4">{requesterName}</p>
          <div className="w-8/12">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{detailsPreview}</p>
          </div>
          <p className="text-sm text-muted-foreground w-1/12">{createdOn}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
