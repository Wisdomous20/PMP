import LeftTab from "@/components/layouts/LeftTab";
import UserManagement from "@/components/user-management/UserManagement";

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-row">
      <LeftTab />
      <UserManagement />
    </div>
  );
}
