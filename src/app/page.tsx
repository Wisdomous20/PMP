import LeftTab from "@/components/layouts/LeftTab"
import CreateServiceRequest from "@/components/create-service-request/CreateServiceRequest"

export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <CreateServiceRequest />
    </div>
  )
}