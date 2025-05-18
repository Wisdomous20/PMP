"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus"
import formatTimestamp from "@/utils/formatTimestamp"

interface UserServiceRequestListProps {
  serviceRequests: ServiceRequest[],
  loading: boolean
}

export default function UserServiceRequestList({ serviceRequests, loading } : UserServiceRequestListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (request : ServiceRequest) => {
    const lastStatus = request.status && request.status.length > 0 
      ? request.status[request.status.length - 1].status 
      : "pending"
      
    switch (lastStatus) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{lastStatus}</Badge>
    }
  }

  const handleRequestClick = (request : ServiceRequest) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  const filteredRequests = mounted ? serviceRequests.filter((request) => {
    const matchesSearch =
      (request.concern?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.id?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (activeTab === "all") return matchesSearch
    
    const lastStatus = request.status && request.status.length > 0 
      ? request.status[request.status.length - 1].status 
      : "pending"
      
    const normalizedStatus = lastStatus === "in_progress" ? "in-progress" : lastStatus
    
    return matchesSearch && normalizedStatus === activeTab
  }) : []

  return (
    <div className="w-full h-full flex flex-row">
      <div className="min-h-screen py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-blue-800">My Service Requests</h1>
            </div>
            <Link href="/service-request/create">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>View and manage all your service requests</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search requests..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  {!mounted || loading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Loading service requests...</p>
                    </div>
                  ) : filteredRequests.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <div
                          key={request.id}
                          className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleRequestClick(request)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{request.concern}</h3>
                                {getStatusBadge(request)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {/* <span>{request.id}</span> */}
                                {formatTimestamp(request.createdOn as Date)}
                                {/* <span>{new Date(request.createdOn).toLocaleDateString()}</span> */}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-600 border-blue-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRequestClick(request)
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{request.details}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No service requests found.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Dialog for ServiceRequestStatus */}
        {mounted && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0">
              {selectedRequest && (
                <ServiceRequestStatus serviceRequest={selectedRequest} />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}