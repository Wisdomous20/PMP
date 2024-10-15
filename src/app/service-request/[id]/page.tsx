import LeftTab from "@/components/layouts/LeftTab"
import ServiceRequestDetails from "@/components/view-service-request/ServiceRequestDetails";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const id = params.id
  console.log(id)

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="flex flex-col w-full">
        <ServiceRequestDetails requestorName="John Doe" title = "IT Support Request" details = "My computer is not turning on. I've checked all the cables and power supply." createdOn = "2023-10-15T14:30:00Z"/>
      </div>
    </div>
  )
}