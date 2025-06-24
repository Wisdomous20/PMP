"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ServiceRequestStatus from "@/components/service-request/ServiceRequestStatus"
import formatTimestamp from "@/utils/formatTimestamp"

interface UserServiceRequestListProps {
  serviceRequests: ServiceRequest[]
  loading: boolean
}

export default function UserServiceRequestList({
  serviceRequests,
  loading,
}: UserServiceRequestListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<
    ServiceRequest | null
  >(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (request: ServiceRequest) => {
    const lastStatus = request.status?.length
      ? request.status[request.status.length - 1].status
      : "pending"

    switch (lastStatus) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> In Progress
          </Badge>
        )
      case "completed":
      case "archived":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        )
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{lastStatus}</Badge>
    }
  }

  const handleRequestClick = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  const filteredRequests = mounted
    ? serviceRequests.filter((request) => {
        const matchesSearch =
          request.concern
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.id?.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === "all") return matchesSearch

        const lastStatus = request.status?.length
          ? request.status[request.status.length - 1].status
          : "pending"

        const normalizedStatus =
          lastStatus === "in_progress"
            ? "in-progress"
            : lastStatus === "archived"
            ? "completed"
            : lastStatus

        return matchesSearch && normalizedStatus === activeTab
      })
    : []

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 lg:px-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-1 sm:mb-0"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
                My Service Requests
              </h1>
            </div>
            <Link href="/service-request/create">
              <Button className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-blue-900">
                <Plus className="h-4 w-4 mr-2" /> New Request
              </Button>
            </Link>
          </div>

          {/* Search & Tabs/Select */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>View and manage your requests</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile: Select */}
              <div className="block sm:hidden mb-4">
                <Select
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Desktop: Tabs */}
              <div className="hidden sm:block">
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4 flex-nowrap">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Content */}
              <div>
                {(!mounted || loading) ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : filteredRequests.length > 0 ? (
                  <div className="space-y-2 sm:space-y-4">
                    {filteredRequests.map((request) => {
                      const lastStatus = request.status?.length
                        ? request.status[request.status.length - 1].status
                        : "pending"
                      const needsRating =
                        lastStatus === "completed"

                      return (
                        <div
                          key={request.id}
                          className="border-2 rounded-lg p-2 sm:p-4 bg-white hover:border-gray-500 hover:shadow transition-shadow cursor-pointer"
                          onClick={() => handleRequestClick(request)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-medium text-sm sm:text-base">
                                  {request.concern}
                                </h3>
                                {getStatusBadge(request)}
                                {needsRating && (
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-100 text-orange-800 border-orange-200 flex items-center gap-1"
                                  >
                                    <Star className="h-3 w-3" /> Rate
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {formatTimestamp(
                                  request.createdOn as Date
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs sm:text-sm text-gray-600">
                            {request.details}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No requests found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {mounted && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="w-full sm:max-w-[600px] max-h-[80vh] overflow-auto p-4">
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
