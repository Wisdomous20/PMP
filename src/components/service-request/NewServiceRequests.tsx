"use client"

import { Skeleton } from "@/components/ui/skeleton"
import ServiceRequestPreview from "./ServiceRequestPreview"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Inbox } from "lucide-react"

interface NewServiceRequestsProps {
  newServiceRequests: ServiceRequest[],
  isLoading: boolean,
  error: string | null
}

export default function NewServiceRequests({newServiceRequests, isLoading, error} : NewServiceRequestsProps) {

  const sortedRequests = isLoading ? [] : [...newServiceRequests].sort((a, b) => {
    const aTime = a.createdOn ? new Date(a.createdOn).getTime() : 0
    const bTime = b.createdOn ? new Date(b.createdOn).getTime() : 0
    return bTime - aTime
  })

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Recent Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Recent Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  if (!sortedRequests.length) {
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
          {sortedRequests.map((request, index) => (
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
