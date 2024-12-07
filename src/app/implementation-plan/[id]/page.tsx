import CreateImplementationPlan from "@/components/implementation-plan/CreateImplementationPlanMyk";
import LeftTab from "@/components/layouts/LeftTab";
import useGetServiceRequestDetails from "@/domains/service-request/hooks/useGetServiceRequestDetails";

interface PageProps {
  params: {
    id: string;
  };
}


export default function Page({ params }: PageProps) {
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