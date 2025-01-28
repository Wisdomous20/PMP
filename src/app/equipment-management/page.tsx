import EquipmentTable from "@/components/equipment-management/EquipmentManagement";
import InventorySummary from "@/components/equipment-management/Inventory-summary";
import LeftTab from "@/components/layouts/LeftTab";

export default function EquipmentManagementBoard() {
  return (
    <div className="w-screen h-screen flex">
      <LeftTab />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Equipment Management Board</h1>
        <InventorySummary />
        <EquipmentTable />
      </div>
    </div>
  );
}
