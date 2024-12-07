import ImplementationPlanForm from "@/components/implementation-plan/ImplementationPlanForm";
import LeftTab from "@/components/layouts/LeftTab";

export default function Page() {
    return (
      <div className="w-screen max-h-screen flex">
        <LeftTab />
        <ImplementationPlanForm />
      </div>
    )
  }