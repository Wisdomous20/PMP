"use client"
import ServiceRequestPreview from "./ServiceRequestPreview";
// import Empty from "../ui/empty";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ServiceRequestProps {
  serviceRequests: ServiceRequest[]
  setServiceRequestIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function ServiceRequestList({ serviceRequests, setServiceRequestIndex }: ServiceRequestProps) {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const filteredRequests = serviceRequests.filter(request =>
    request.concern.toLowerCase().includes(search.toLowerCase()) ||
    request.requesterName.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="w-3/6 h-full flex flex-col overflow-y-auto scrollbar-hide overflow-x-hidden space-y-2 p-2 relative">
      <div className="items-center px-3">
        <h1 className="text-md sm:text-2xl font-semibold text-indigo-text py-3"> Service Requests </h1>
      </div>
      <div className="flex items-center px-3 pb-5">
        <Input
          type="text"
          placeholder="Search by title or requester..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md hidden sm:block w-2/3" // Visible on large screens
        />
        <button
          onClick={toggleSearch}
          className="p-2 sm:hidden block">
          <Search className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      {/* {filteredRequests.length > 0 ? (
        filteredRequests.map((request, index) => (
          <ServiceRequestPreview key={index} index={index} serviceRequest={request} setServiceRequestIndex={setServiceRequestIndex}/>
        ))
      ) : (
        <Empty />
      )} */}
      {
        filteredRequests.map((request, index) => (
          <ServiceRequestPreview key={index} index={index} serviceRequest={request} setServiceRequestIndex={setServiceRequestIndex} />
        ))
      }
      {isSearchOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 sm:w-2/3">
            <h2 className="text-lg font-semibold mb-4">Search Service Requests</h2>
            <Input
              type="text"
              placeholder="Search by title or requester..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md w-full"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={toggleSearch}
                variant="gold"
                className="bg-indigo-Background text-white px-4 py-2 rounded-md">
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}