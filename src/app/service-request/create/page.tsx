import CreateServiceRequest from "@/components/service-request/CreateServiceRequest"
import { Suspense } from "react"
// import LeftTab from "@/components/layouts/LeftTab";
export default function Page() {
  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-yellow-50 to-blue-50">
      {/* <LeftTab /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <CreateServiceRequest />
      </Suspense>
    </div>
  )
}