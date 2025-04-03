"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import useGetArchivedServiceRequests from "@/domains/service-request/hooks/useGetArchivedServiceRequests";
import fetchDeleteSelectedServiceRequestArchive from "@/domains/service-request/services/fetchDeleteSelectedServiceRequestArchive";
import ArchiveDetailsModal from "./ArchiveDetailsModal";

export default function Archives() {
  const { archivedRequests, loading, error, refreshArchives } =
    useGetArchivedServiceRequests();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Enhanced search to include both title and requestor name
  const filteredRequests =
    archivedRequests?.filter((request) =>
      searchTerm === ""
        ? true
        : request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to delete.",
        variant: "destructive",
      });
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} selected item(s)?`
      )
    ) {
      try {
        setIsDeleting(true);
        await fetchDeleteSelectedServiceRequestArchive(selectedItems);
        toast({
          title: "Success",
          description: `Successfully deleted ${selectedItems.length} item(s)`,
        });
        setSelectedItems([]);
        refreshArchives();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete selected items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
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
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Archives</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Archives</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Error loading archived service requests: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 relative">
      <h1 className="text-2xl font-bold mb-6">Archives</h1>

      <div className="flex justify-between mb-6">
        <div className="relative w-80">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
            placeholder="Search by title or requestor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
          {searchTerm && (
            <button
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="bg-red-600 text-white"
            onClick={handleDelete}
            disabled={selectedItems.length === 0 || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div>
        <div className="bg-gray-100 rounded-t-md ">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium text-sm">
            <div className="col-span-1 flex items-center justify-center" />
            <div className="col-span-3 font-bold">Name of Requestor</div>
            <div className="col-span-3 items-center justify-center font-bold">
              Title
            </div>
            <div className="col-span-3 font-bold">Request Date</div>
            <div className="col-span-2 items-center justify-center font-bold">
              Status
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-md">
              {searchTerm
                ? "No matching service requests found"
                : "No archived service requests found"}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleRequestClick(request)}
              >
                <div
                  className="col-span-1 flex"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedItems.includes(request.id)}
                    onCheckedChange={() => toggleSelectItem(request.id)}
                  />
                </div>
                <div className="col-span-3 flex items-center pl-2">
                  {request.name}
                </div>
                <div className="col-span-3 flex items-center">
                  {request.title}
                </div>
                <div className="col-span-3 flex items-center">
                  {request.requestDate
                    ? format(new Date(request.requestDate), "MMM d, yyyy")
                    : "N/A"}
                </div>
                <div className="col-span-2 flex items-center text-green-600 font-medium">
                  {"Completed"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedRequest && (
        <ArchiveDetailsModal
          request={selectedRequest}
          onClose={closeRequestDetails}
        />
      )}
    </div>
  );
}
