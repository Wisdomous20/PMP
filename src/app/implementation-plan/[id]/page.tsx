import ImplementationPlanForm from "@/components/implementation-plan/ImplementationPlanForm";
import LeftTab from "@/components/layouts/LeftTab";

interface PageProps {
  params: {
    id: string;
  };
}


export default function Page({ params }: PageProps) {
    return (
      <div className="w-screen max-h-screen flex">
        <LeftTab />
        <ImplementationPlanForm serviceRequestId={params.id}/>
      </div>
    )
  }