"use client";

import { Button } from "@/components/ui/button";
import { Circle, Plus, FileText, Archive, ArrowLeft } from "lucide-react";
import Link from "next/link";
import useGetUserRole from "@/hooks/useGetUserRole";

export default function LeftTab() {
  const { userRole, loading } = useGetUserRole();
  console.log(userRole);

  if (loading) {
    return <div> Loading </div>;
  }

  return (
    <div className="w-12 border-r bg-background flex flex-col items-center py-2 space-y-4">
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <Circle className="w-4 h-4" />
        <span className="sr-only">Circle</span>
      </Button>
      {userRole === "USER" && (
        <Link href="/service-request/create">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Plus className="w-4 h-4" />
            <span className="sr-only">Create Service Request</span>
          </Button>
        </Link>
      )}

      <Link href="/service-request">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <FileText className="w-4 h-4" />
          <span className="sr-only">Service Request List</span>
        </Button>
      </Link>
      <Link href="/service-request/archive">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Archive className="w-4 h-4" />
          <span className="sr-only">Archive</span>
        </Button>
      </Link>
      <Link href="/{handleLogout}">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
    </div>
  );
}
