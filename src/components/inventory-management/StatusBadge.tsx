import {Badge} from "@/components/ui/badge";
import {EquipmentObjectStatus} from "@/lib/types/InventoryManagementTypes";
import * as helpers from "@/lib/types/InventoryManagementTypesHelpers";

export function StatusBadge({ status }: { status: EquipmentObjectStatus }) {
  let className = "bg-red-500 hover:bg-red-600";
  if (status === EquipmentObjectStatus.Operational) className = "bg-green-500 hover:bg-green-600";
  if (status === EquipmentObjectStatus.Repairable) className = "bg-yellow-500 hover:bg-yellow-600";

  return <Badge className={className}>{helpers.equipmentObjectStatusToString(status)}</Badge>;
}
