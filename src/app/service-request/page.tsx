import LeftTab from "@/components/layouts/LeftTab"
import ServiceRequestList from "@/components/view-service-request/ServiceRequestList"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <Card className="flex flex-col w-full px-4 ">
        <CardHeader className="pb-4 items-center">
          <h1 className="text-2xl font-semibold"> Service Requests </h1>
        </CardHeader>
        <Separator className="mb-4" />
        <ServiceRequestList />
      </Card>
    </div>
  )
}