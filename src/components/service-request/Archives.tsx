/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useGetArchivedServiceRequests from "@/domains/service-request/hooks/useGetArchivedServiceRequests";
import ArchiveDetailsModal from "./ArchiveDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Archives() {
  const { archivedRequests, loading, error } = useGetArchivedServiceRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests =
    archivedRequests?.filter((request) =>
      searchTerm === ""
        ? true
        : request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRequests = filteredRequests.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRequestClick = (request: any) => {
    console.log("Selected request:", request);
    setSelectedRequest(request);
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <Skeleton className="h-8 w-32 mb-6 shrink-0" />

        <div className="flex justify-between mb-6 shrink-0">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-6 rounded" />
            <Skeleton className="h-10 w-80 rounded" />
          </div>
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        <div className="bg-gray-200 rounded-t-md">
          <div className="grid grid-cols-12 gap-4 px-6 py-5">
            <div className="col-span-1" />
            <Skeleton className="col-span-2 h-6" />
            <Skeleton className="col-span-3 h-6" />
            <Skeleton className="col-span-3 h-6" />
            <Skeleton className="col-span-2 h-6" />
          </div>
        </div>

        <div className="space-y-2 mt-2 overflow-y-auto flex-1 pr-2">
          {[...Array(9)].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md"
            >
              <div className="col-span-1 flex items-center justify-center">
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6 text-indigo-dark tracking-tight shrink-0">
          Archives
        </h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Error loading archived service requests: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50 rounded-md overflow-hidden">
      <h1 className="text-2xl font-semibold mb-6 shrink-0  text-indigo-dark">Archives</h1>

      <div className="flex justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center space-x-2">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      </div>
  
      <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="rounded-t-md shadow-md bg-yellow-500 hover:bg-yellow-500 h-16">
              <TableHead className="w-1/3 py-3 text-center text-base font-bold text-indigo-dark">Name of Requestor</TableHead>
              <TableHead className="w-1/3 py-3 text-center text-base font-bold text-indigo-dark">Title</TableHead>
              <TableHead className="w-1/3 py-3 text-center text-base font-bold text-indigo-dark">Request Date</TableHead>
              <TableHead className="w-1/3 py-3 text-center text-base font-bold text-indigo-dark">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  {searchTerm
                    ? "No matching service requests found"
                    : "No archived service requests found"}
                </TableCell>
              </TableRow>
            ) : (
              displayedRequests.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-200 cursor-pointer transition text-center"
                  onClick={() => handleRequestClick(request)}
                >
                  <TableCell className="px-3 py-4">{request.name}</TableCell>
                  <TableCell className="px-3 py-4">{request.title}</TableCell>
                  <TableCell className="px-3 py-4">
                    {request.requestDate
                      ? format(new Date(request.requestDate), "MMM d, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-10 py-4 text-green-600 font-medium">
                    Completed
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
  
      {totalPages > 1 && (
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-b from-yellow-50 to-blue-50 p-4 z-10">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm font-semibold  text-indigo-dark">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 " />
            </Button>
          </div>
        </div>
      )}
  
      {selectedRequest && (
        <ArchiveDetailsModal request={selectedRequest} onClose={closeRequestDetails} />
      )}
    </div>
  );  
}
