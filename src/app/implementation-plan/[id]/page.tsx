import { use } from "react";
import CreateImplementationPlan from "@/components/implementation-plan/CreateImplementationPlanMyk";
import LeftTab from "@/components/layouts/LeftTab";
import useGetServiceRequestDetails from "@/domains/service-request/hooks/useGetServiceRequestDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);
  const { serviceRequestDetails, loading } = useGetServiceRequestDetails(params.id)

  if (loading) {
    return (
      <div> loading </div>
    )
  }

  return (
    <div className="w-screen max-h-screen flex">
      <LeftTab />
      <CreateImplementationPlan serviceRequest={serviceRequestDetails as ServiceRequest}/>
    </div>
  )
}