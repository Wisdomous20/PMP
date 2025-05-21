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
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col h-full">
        <Skeleton className="h-8 w-32 mb-6 shrink-0" />

        <div className="flex justify-between mb-6 shrink-0">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-6 rounded" />
            <Skeleton className="h-10 w-80 rounded" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[30%]">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                  <TableHead className="w-[30%]">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                  <TableHead className="w-[25%]">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                  <TableHead className="w-[15%]">
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(9)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
    <div className="flex-1 p-8 flex flex-col w-full h-full">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold mb-6">Archives</h1>

        <div className="flex justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center space-x-2">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="rounded-t-md shadow-md">
                <TableHead className="py-5 text-base font-bold">
                  Name of Requestor
                </TableHead>
                <TableHead className="py-5 text-base font-bold">
                  Title
                </TableHead>
                <TableHead className="py-5 text-base font-bold">
                  Request Date
                </TableHead>
                <TableHead className="py-5 text-base font-bold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    {searchTerm
                      ? "No matching service requests found"
                      : "No archived service requests found"}
                  </TableCell>
                </TableRow>
              ) : (
                displayedRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="bg-gray-100 hover:bg-gray-300 transition-colors cursor-pointer"
                    onClick={() => handleRequestClick(request)}
                  >
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>
                      {request.requestDate
                        ? format(new Date(request.requestDate), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      Completed
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredRequests.length > 0 && (
        <div className="flex items-center justify-between mt-4 py-2 shrink-0">
          <div className="text-sm text-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedRequest && (
        <ArchiveDetailsModal
          request={selectedRequest}
          onClose={closeRequestDetails}
        />
      )}
    </div>
  );
}
