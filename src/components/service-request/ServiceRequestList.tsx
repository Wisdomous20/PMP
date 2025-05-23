"use client"
import ServiceRequestPreview from "./ServiceRequestPreview";
// import Empty from "../ui/empty";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton"

interface ServiceRequestProps {
  serviceRequests: ServiceRequest[];
  setServiceRequestIndex: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}
export default function ServiceRequestList({ serviceRequests, setServiceRequestIndex, loading, search, setSearch }: ServiceRequestProps) {

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-[500px] h-full max-h-screen overflow-y-auto flex flex-col border-r border-gray-200 bg-white">
      <div className="items-center px-3">
        <h2 className="text-2xl font-semibold text-indigo-text pl-3 pt-6 tracking-tight"> Service Requests </h2>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm bg-transparent border-none focus:ring-0 flex-grow"
        />
      </div>

      <div className="overflow-y-auto">
        {serviceRequests.map((request, index) => (
          <ServiceRequestPreview
            key={index}
            index={index}
            serviceRequest={request}
            setServiceRequestIndex={setServiceRequestIndex}
          />
        ))}
        {serviceRequests.length === 0 && (
          <div className="p-4 text-center text-gray-500">No service requests found.</div>
        )}
      </div>
    </div>
  );
}