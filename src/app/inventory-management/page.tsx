import LeftTab from "@/components/layouts/LeftTab";
import EquipmentTable from "@/components/inventory-management/InventoryManagement";

export default function EquipmentManagementBoard() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="p-6">
          <EquipmentTable />
        </div>
      </div>
    </div>
  );
}
