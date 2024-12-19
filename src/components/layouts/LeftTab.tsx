"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Archive, LogOut, Folder } from "lucide-react";
import Link from "next/link";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import LoadingSpinner from "@/components/ui/loadingDots";

export default function LeftTab() {
  const { userRole, loading } = useGetUserRole();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (loading) {
    return (
      <div className="w-13 border-r bg-gray-300 flex flex-col items-center py-4 space-y-3">
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="sr-only">Loading CPU Logo</span>
        </Skeleton>
  
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Create Service Request Button</span>
        </Skeleton>
  
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Service Request List Button</span>
        </Skeleton>
  
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Archive Button</span>
        </Skeleton>
  
       
      </div>
    );
  }
  
  return (
    <div className="w-13 border-r bg-indigo-Background flex flex-col items-center py-4 space-y-3">
      <Button variant="gold" size="icon" className="w-11 h-12">
        <img
          src="/images/cpu-logo.png"
          alt="CPU Logo"
          className="w-8 h-8"
        />
        <span className="sr-only">CPU Logo</span>
      </Button>
      
      {userRole === "USER" && (
        <Link href="/service-request/create">
          <Button variant="gold" size="icon" className="w-11 h-12">
            <Plus className="w-7 h-7" />
            <span className="sr-only">Create Service Request</span>
          </Button>
        </Link>
      )}

      {(userRole === "SUPERVISOR" || userRole === "ADMIN") && (
        <Link href="/projects">
          <Button variant="gold" size="icon" className="w-11 h-12">
            <Folder className="w-6 h-6" />
            <span className="sr-only">Projects</span>
          </Button>
        </Link>
      )}

      <Link href="/service-request">
        <Button variant="gold" size="icon" className="w-11 h-12">
          <FileText className="w-6 h-6" />
          <span className="sr-only">Service Request List</span>
        </Button>
      </Link>
      
      <Link href="/service-request/archive">
        <Button variant="gold" size="icon" className="w-11 h-12">
          <Archive className="w-6 h-6" />
          <span className="sr-only">Archive</span>
        </Button>
      </Link>
      
      <Link href="/auth/login" onClick={handleLogout}>
        <Button variant="gold" size="icon" className="w-11 h-12">
          <LogOut className="w-6 h-6" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
    </div>
  );
}
