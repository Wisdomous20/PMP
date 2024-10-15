import LeftTab from "@/components/layouts/LeftTab"
import ServiceRequestList from "@/components/view-service-request/ServiceRequestList"

export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="flex flex-col w-full">
        <div className="w-full h-[80px] text-center text-3xl font-semibold p-4"> Service Requests </div>
        <ServiceRequestList />
      </div>
    </div>
  )
}