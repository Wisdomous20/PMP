import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: "available" | "in-use" | "under-maintenance" | "replaced";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = {
    available: "bg-green-500 hover:bg-green-600",
    "in-use": "bg-blue-500 hover:bg-blue-600",
    "under-maintenance": "bg-yellow-500 hover:bg-yellow-600",
    replaced: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <Badge className={statusStyles[status]}>{status.replace("-", " ")}</Badge>
  );
}
