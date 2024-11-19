import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import { useState,} from "react";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  id: string;
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestPreviewShe({ id, requesterName, title, details, createdOn}: ServiceRequestPreviewProps) {
  const detailsPreview = details.length > 100? details.slice(0, 100) + '...' : details;
  const [search, setSearch] = useState('');
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
      <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{requesterName}</h2>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <span className="text-sm text-gray-500">{formatTimestamp(createdOn)}</span>
      </CardContent>
      <div className="mt-4 flex justify-end space-x-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-md">
            Reject Request
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md">
            Approve Request
          </button>
        </div>
    </Card>
  </Link>
);
}
