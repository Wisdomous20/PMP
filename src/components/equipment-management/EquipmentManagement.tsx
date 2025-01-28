import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { PlusCircle } from "lucide-react";

const mockData = [
  {
    id: 1,
    name: "Laptop",
    status: "available",
    lastChecked: "2025-01-01",
    department: "Engi",
    requester: "Si carlo",
  },
  {
    id: 2,
    name: "feelings",
    status: "under-maintenance",
    lastChecked: "2025-01-01",
    department: "Engi",
    requester: "Si carlo",
  },
];

export default function EquipmentTable() {
  return (
    <div>
      <div className="flex justify-end mb-4 pt-3">
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={
                      item.status as
                        | "available"
                        | "in-use"
                        | "under-maintenance"
                        | "replaced"
                    }
                  />
                </TableCell>
                <TableCell>{item.lastChecked}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.requester}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
