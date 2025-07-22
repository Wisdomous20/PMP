"use client";

import LeftTab from "@/components/layouts/LeftTab";
import CreateServiceRequest from "@/components/service-request/CreateServiceRequest";
import Dashboard from "@/components/dashboard/Dashboard";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    const { role } = session.user;
    return (
      <div className="w-screen h-screen flex">
        <LeftTab />
        {
          role === "ADMIN" || role === "SUPERVISOR" || role === "SECRETARY"
            ? <Dashboard />
            : <CreateServiceRequest />
        }
      </div>
    )
  }

  return (<></>)
}
