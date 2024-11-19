import { Card, CardContent, CardHeader } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import { useState,} from "react";
import Link from "next/link";
import { Input } from "../ui/input";


interface ServiceRequestPreviewProps {
  id: string;
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestPreviewShe({ id, requesterName, title, details, createdOn}: ServiceRequestPreviewProps) {
  const detailsPreview = details.length > 50? details.slice(0,50) + '...' : details;
  return (

    // <Button 
    //       variant={filter === 'all' ? 'default' : 'outline'}
    //       onClick={() => setFilter('all')}
    //     >
    //       All
    //     </Button> 
    //     <Button 
    //       variant={filter === 'urgent' ? 'default' : 'outline'}
    //       onClick={() => setFilter('urgent')}
    //     >
    //       Urgent
    //     </Button>
    //     <Button 
    //       variant={filter === 'normal' ? 'default' : 'outline'}
    //       onClick={() => setFilter('normal')}
    //     >
    //       Normal
    //     </Button>
    <Link href={`/service-request/${id}`}>
    <Card key={id}>
      <CardContent className="flex justify-between items-center p-4">
        <div className="pb-2">
          <h2 className="pb-2 text-md font-semibold">{requesterName}</h2>
          <p className="pb-1text-sm text-gray-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{detailsPreview}</p>
        </div>
        <span className="text-sm text-gray-500">{formatTimestamp(createdOn)}</span>
      </CardContent>
      <div className="m-3 flex justify-start space-x-4">
          <button className="px-3 py-3 bg-gray-500 text-white text-xs rounded-md">
            Reject Request
          </button>
          <button className="px-3 py-3 bg-gray-500 text-white text-xs rounded-md">
            Approve Request
          </button>
        </div>
    </Card>
  </Link>
);
}
