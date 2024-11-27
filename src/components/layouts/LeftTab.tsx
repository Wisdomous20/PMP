"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Archive,LogOut } from "lucide-react";
import Link from "next/link";
import useGetUserRole from "@/hooks/useGetUserRole";

export default function LeftTab() {
  const { userRole, loading } = useGetUserRole();
  console.log(userRole);

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-13 border-r bg-indigo-800 flex flex-col items-center py-4 space-y-3">
      <Button variant="gold" size="icon" className="w-11 h-12">
      <img 
          src="/images/cpu-logo.png" 
          alt="CPU Logo" 
          className="w-8 h-8" 
        />
        <span className="sr-only">CPU Logo</span>
      </Button>
      {userRole === "USER" && (
        <Link href="/">
          <Button variant="gold" size="icon" className="w-11 h-12">
            <Plus className="w-7 h-7" />
            <span className="sr-only">Create Service Request</span>
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
