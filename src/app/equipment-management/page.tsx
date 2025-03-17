import LeftTab from "@/components/layouts/LeftTab";
import EquipmentTable from "@/components/equipment-management/InventoryManagement";
export default function EquipmentManagementBoard() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="container mx-auto p-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Report Summary</h1>
        </div>

        <EquipmentTable />
      </div>
    </div>
  );
}
