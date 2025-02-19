/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddEquipment from "@/components/equipment-management/addEquipment";
import { DeleteEquipment } from "./DeleteEquipment";
import { EditEquipment } from "./EditEquipment";
import fetchGetEquipmentById from "@/domains/equipment-management/services/fetchGetEquipmentById";
import fetchGetAllEquipment from "@/domains/equipment-management/services/fetchGetAllEquipment";
import { useSession } from "next-auth/react";
import getUserRoleFetch from "@/domains/user-management/services/getUserRoleFetch";
interface EquipmentTableProps {
  serviceRequestId?: string;
}

export default function EquipmentTable({
  serviceRequestId,
}: EquipmentTableProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<UserRole>(null);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      if (serviceRequestId) {
        const data = await fetchGetEquipmentById(serviceRequestId);
        setEquipment(data || []);
      } else {
        const data = await fetchGetAllEquipment();
        setEquipment(data || []);
      }
    } catch (error) {
      console.error("Failed to load equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRole = async () => {
    try {
      if (session?.user?.id) {
        const { userRole } = await getUserRoleFetch(session.user.id);
        setUserRole(userRole as UserRole);
      }
    } catch (error) {
      console.error("Failed to load user role:", error);
    }
  };
  useEffect(() => {
    loadEquipment();
    loadUserRole();
  }, [serviceRequestId, session]);
  const handleEquipmentDeleted = async () => {
    await loadEquipment();
  };

  const handleEquipmentAdded = async () => {
    setIsDialogOpen(false);
    await loadEquipment();
  };

  if (isLoading) {
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

  return (
    <div>
      <div className="flex justify-end mb-4 pt-3">
        {/* {userRole === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <AddEquipment
                serviceRequestId={serviceRequestId}
                onSuccess={handleEquipmentAdded}
              />
            </DialogContent>
          </Dialog>
        )} */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <AddEquipment
              serviceRequestId={serviceRequestId}
              onSuccess={handleEquipmentAdded}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
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
              {(serviceRequestId || userRole === "ADMIN") && (
                <TableHead>Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item: Equipment, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.unitCost}</TableCell>
                <TableCell>{item.totalCost}</TableCell>
                <TableCell>
                  {new Date(item.datePurchased).toDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.dateReceived).toDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.department}</TableCell>

                <TableCell>
                  {(serviceRequestId || userRole === "ADMIN") && (
                    <div className="flex space-x-2">
                      <EditEquipment
                        equipment={item}
                        onUpdate={loadEquipment}
                      // serviceRequestId={serviceRequestId}
                      />
                      <DeleteEquipment
                        equipmentId={item.id}
                        description={item.description}
                        onDelete={handleEquipmentDeleted}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
