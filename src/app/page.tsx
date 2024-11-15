"use client";
import LeftTab from "@/components/layouts/LeftTab";
import CreateServiceRequest from "@/components/create-service-request/CreateServiceRequest";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);

  if (!session) {
    router.push("/auth/login");
  }

  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <CreateServiceRequest />
    </div>
  );
}
