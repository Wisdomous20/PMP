"use client"
import ServiceRequestPreview from "./ServiceRequestPreview"
import getServiceRequestFetch from "@/utils/service-request/getServiceRequestFetch"
import useGetSessionData from "@/hooks/useGetSessionData";
import { useState, useEffect } from "react";

export default function ServiceRequestList() {
  const [ ServiceRequests, setServiceRequests ] = useState<ServiceRequest[]>([])
  const { sessionData: session } = useGetSessionData()

  useEffect(() => {
    const fetchServiceRequests = async () => {
      console.log(session)
      if (session?.user.id) {
        const ServiceRequestsInitial = await getServiceRequestFetch(session.user.id)
        setServiceRequests(ServiceRequestsInitial)
        console.log(ServiceRequestsInitial)
      }
    }

    fetchServiceRequests()
  }, [])

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll overflow-x-hidden space-y-2">
      {ServiceRequests.map((request, index) => (
        <ServiceRequestPreview key={index} {...request} />
      ))}
    </div>
  )
}