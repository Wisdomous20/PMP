"use client";
import { useEffect, useState } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { PlusCircle } from "lucide-react";
import fetchGetAllEquipment from "@/domains/equipment-management/services/fetchGetAllEquipment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddEquipment from "@/components/equipment-management/addEquipment";
import { EquipmentStatus } from "@/domains/equipment-management/types/equipmentType";

interface Equipment {
  id: string;
  qty: number;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
  datePurchased: Date;
  dateRecieved: Date;
  status: EquipmentStatus;
  location: string;
  department: string;
  serviceRequestId: string;
  remarks: string;
}

export default function EquipmentTable() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await fetchGetAllEquipment();
        if (data) {
          setEquipment(data);
        }
      } catch (error) {
        console.error("Failed to load equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const practicelangni = [
    {
      id: "1",
      qty: "2",
      description: "Laptop",
      brand: "HP",
      serialNumber: "123456",
      supplier: "HP",
      UnitCost: 1000,
      TotalCost: 2000,
      DatePurchased: new Date(),
      DateRecieved: new Date(),
      status: "Operational",
      location: "Office",
      department: "engi",
      remarks: "I need new laptop",
      serviceRequestId: "",
    },
  ];
  return (
    <div>
      <div className="flex justify-end mb-4 pt-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-scroll">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <AddEquipment />
            {/* DIRI ANG MODAL SANG ADD EQUIPMENT CTRL+ CLICK ANG ADD EQUIPMENT*/}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Qty</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Brand/Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Date Purchased</TableHead>
              <TableHead>Date Recieved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {equipment.map((item: Equipment, index: number) => (
            <TableRow key={index}>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.serialNumber}</TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell>{item.unitCost}</TableCell>
              <TableCell>{item.totalCost}</TableCell>
              <TableCell>{item.datePurchased.toDateString()}</TableCell>
              <TableCell>{item.dateRecieved.toDateString()}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.remarks}</TableCell>
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
