import CreateServiceRequest from "@/components/service-request/CreateServiceRequest"
import LeftTab from "@/components/layouts/LeftTab";
export default function Page() {
  return (
    <div className="w-screen h-screen flex bg-radial-gradient">
      <LeftTab />
      <CreateServiceRequest />
    </div>
  )
}