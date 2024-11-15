"use client"
import ServiceRequestPreview from "./ServiceRequestPreview"
import useGetServiceRequestList from "@/hooks/useGetServiceRequestList"

export default function ServiceRequestList() {
  const {serviceRequests} = useGetServiceRequestList();

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden space-y-2">
      {serviceRequests.map((request, index) => (
        <ServiceRequestPreview key={index} {...request} />
      ))}
    </div>
  )
}