import PersonnelManagement from "@/components/personnel-management/personnel-management";
import LeftTab from "@/components/layouts/LeftTab";

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-row">
      <LeftTab />
        <PersonnelManagement />
    </div>
  );
}
