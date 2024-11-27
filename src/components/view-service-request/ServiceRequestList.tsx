"use client"
import useGetServiceRequestList from "@/hooks/useGetServiceRequestList";
import ServiceRequestPreview from "./ServiceRequestPreview";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ServiceRequestList() {
  const { serviceRequests } = useGetServiceRequestList();
  const [search, setSearch] = useState('');

  return (
    <div className="w-3/6 h-full flex flex-col overflow-y-auto scrollbar-hide overflow-x-hidden space-y-2 p-2">
      <div className="items-center">
        <h1 className="text-2xl font-semibold"> Service Requests </h1>
      </div>
      <div className="items-center">
        <Input
          type="text"
          placeholder="Search by title or requester..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p- border border-gray-300 rounded-md w-2/3"
        />
      </div>
      {serviceRequests.map((request, index) => (
        <ServiceRequestPreview key={index} {...request} />
      ))}
    </div>
  );
}
