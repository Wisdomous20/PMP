import ServiceRequestKanban from "@/components/implementation-plan/Kanban-board";
import LeftTab from "@/components/layouts/LeftTab";
export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="w-screen max-h-screen flex p-12 overflow-y-auto">
        <ServiceRequestKanban />
      </div>
    </div>
  );
}
