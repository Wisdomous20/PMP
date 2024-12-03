"use client"
import useGetServiceRequestList from "@/domains/service-request/hooks/useGetServiceRequestList";
import ServiceRequestPreview from "./ServiceRequestPreview";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ServiceRequestList() {
  const { serviceRequests } = useGetServiceRequestList();
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text; // Return original text if no search term

    const regex = new RegExp(`(${searchTerm})`, 'gi'); // Create a case-insensitive regex
    const parts = text.split(regex); // Split text by search term
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <span key={index} className="bg-yellow-300">{part}</span> : part // Highlight matching part
    );
  };
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
      {serviceRequests.map((request, index) => (
        <ServiceRequestPreview key={index} {...request} />
      ))}
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