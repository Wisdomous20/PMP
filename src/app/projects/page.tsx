import ImplementationPlansBoard from "@/components/implementation-plan/ImplementationPlanBoard";
import LeftTab from "@/components/layouts/LeftTab";
export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="w-screen max-h-screen flex p-4 overflow-y-auto bg-gradient-to-b from-yellow-50 to-blue-50 ">
        <ImplementationPlansBoard />
      </div>
    </div>
  );
}
