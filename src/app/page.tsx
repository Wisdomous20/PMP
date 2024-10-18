import LeftTab from "@/components/layouts/LeftTab"
import ServiceRequestList from "@/components/view-service-request/ServiceRequestList"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import CreateServiceRequest from "@/components/create-service-request/CreateServiceRequest"

export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <CreateServiceRequest />
    </div>
  )
}