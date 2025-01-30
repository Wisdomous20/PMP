import PersonnelManagement from "@/components/personnel-management/personnel-management";
import LeftTab from "@/components/layouts/LeftTab";

export default function Page() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="w-screen max-h-screen flex p-4 overflow-y-auto">
        <PersonnelManagement />
      </div>
    </div>
  );
}
