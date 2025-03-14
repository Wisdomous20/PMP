// import EquipmentTable from "@/components/equipment-management/EquipmentManagement";
import InventorySummary from "@/components/equipment-management/Inventory-summary";
import LeftTab from "@/components/layouts/LeftTab";
import EquipmentTable from "@/components/equipment-management/EquipmentManagement";
export default function EquipmentManagementBoard() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="container mx-auto p-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold">Equipment Management Board</h1>
        </div>
        <InventorySummary />
        <EquipmentTable />
      </div>
    </div>
  );
}
