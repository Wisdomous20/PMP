"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ServiceRequestPreview from "./ServiceRequestPreview"
import { fetchPendingServiceRequests } from "@/domains/service-request/services/fetchPendingServiceRequests"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Inbox } from "lucide-react"

export default function NewServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true)
        const data = await fetchPendingServiceRequests()
        setServiceRequests(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching pending service requests:", err)
        setError(err.message || "Error loading service requests")
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [])

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    )
  }

  if (!serviceRequests.length) {
    return (
      <Card className="w-full h-full p-8 flex flex-col items-center justify-center">
        <Inbox className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">You&apos;re all caught up!</h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          There are no pending service requests at the moment.
        </p>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-md sm:text-lg font-semibold text-indigo-text">
          Recent Pending Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-y-auto">
          {serviceRequests.map((request, index) => (
            <ServiceRequestPreview
              key={request.id}
              index={index}
              serviceRequest={request}
              setServiceRequestIndex={() => null}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
