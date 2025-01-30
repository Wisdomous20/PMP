import { Badge } from "@/components/ui/badge";
import { EquipmentStatus } from "@/domains/equipment-management/types/equipmentType";

export function StatusBadge({ status }: { status: EquipmentStatus }) {
  const statusStyles = {
    Operational: "bg-green-500 hover:bg-green-600",
    Repairable: "bg-yellow-500 hover:bg-yellow-600",
    Scrap: "bg-red-500 hover:bg-red-600",
  };

  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
