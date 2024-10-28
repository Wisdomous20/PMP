import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  id: string;
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
  status: 'urgent' | 'normal';
}

export default function ServiceRequestPreviewShe({ id, requesterName, title, details, createdOn }: ServiceRequestPreviewProps) {
  const status = "urgent"
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
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">{requesterName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
              status === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {status === 'urgent' ? 'Urgent' : 'Normal'}
            </span>
            <span className="text-sm text-gray-500">{formatTimestamp(createdOn)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
