import { Card, CardContent } from "@/components/ui/card";
import formatTimestamp from "@/utils/formatTimestamp";
import Link from "next/link";

interface ServiceRequestPreviewProps {
  id: string;
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestPreview({
  id,
  requesterName,
  title,
  details,
  createdOn,
}: ServiceRequestPreviewProps) {
  const detailsPreview =
    details.length > 50 ? details.slice(0, 50) + "..." : details;
  const formattedDate = formatTimestamp(createdOn);
  return (
    <Link href={`/service-request/${id}`}>
      <Card
        id="view-request-card-preview"
        className="w-full p-2 px-4 hover:shadow-lg hover:bg-gray-100"
      >
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

// export default function Component() {
//   const [filter, setFilter] = useState<'all' | 'urgent' | 'normal'>('all')

//   const filteredRequests = requests.filter(request => 
//     filter === 'all' || request.priority === filter
//   )

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
//       <div className="mb-4 space-x-2">
//         <Button 
//           variant={filter === 'all' ? 'default' : 'outline'}
//           onClick={() => setFilter('all')}
//         >
//           All
//         </Button>
//         <Button 
//           variant={filter === 'urgent' ? 'default' : 'outline'}
//           onClick={() => setFilter('urgent')}
//         >
//           Urgent
//         </Button>
//         <Button 
//           variant={filter === 'normal' ? 'default' : 'outline'}
//           onClick={() => setFilter('normal')}
//         >
//           Normal
//         </Button>
//       </div>
//       <div className="space-y-4">
//         {filteredRequests.map(request => (
//           <Card key={request.id}>
//             <CardContent className="flex justify-between items-center p-4">
//               <div>
//                 <h2 className="text-lg font-semibold">{request.title}</h2>
//                 <p className="text-sm text-gray-500">{request.requester}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                   request.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
//                 }`}>
//                   {request.priority}
//                 </span>
//                 <span className="text-sm text-gray-500">{request.date}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
