"use client"
import ServiceRequestPreview from "./ServiceRequestPreview";
// import Empty from "../ui/empty";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton"

interface ServiceRequestProps {
  serviceRequests: ServiceRequest[]
  setServiceRequestIndex: React.Dispatch<React.SetStateAction<number>>
  loading: boolean
}
  
export default function ServiceRequestList({ serviceRequests, setServiceRequestIndex, loading }: ServiceRequestProps) {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const filteredRequests = serviceRequests.filter(request =>
    request.concern.toLowerCase().includes(search.toLowerCase()) ||
    request.requesterName.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="w-[460px] h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="items-center px-3">
      <h2 className="text-md sm:text-2xl font-semibold text-indigo-text pt-3"> Service Requests </h2>
      </div>

    {/* Search Bar */}
    <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
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
        {filteredRequests.map((request, index) => (
          <ServiceRequestPreview
            key={index}
            index={index}
            serviceRequest={request}
            setServiceRequestIndex={setServiceRequestIndex}
          />
        ))}
      </div>
  </div>
  );
}
