"use client"
import useGetServiceRequestList from "@/hooks/useGetServiceRequestList";
import ServiceRequestPreviewShe from "./ServiceRequestPreviewShe";
import { useState } from "react";
import {Input} from "@/components/ui/input";

export default function ServiceRequestList() {
  const { serviceRequests } = useGetServiceRequestList();
  const [search, setSearch] = useState('');

  return (
    <div className="w-3/6 h-full flex flex-col overflow-y-scroll overflow-x-hidden space-y-2">
      <div className="pt-3 pl-3 items-center">
      <h1 className="text-2xl font-semibold"> Service Requests </h1>
      </div>
      <div className="pl-3 items-center">
        <Input
          type="text"
          placeholder="Search by title or requester..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-4 border border-gray-300 rounded-md w-2/3"
        />
      </div>
      {serviceRequests.map((request, index) => (
        <ServiceRequestPreviewShe key={index} {...request} />
      ))}
    </div>
  );
}
