"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EquipmentStatus } from "@/domains/equipment-management/types/equipmentType";
import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

export default function AddEquipment() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    qty: 0,
    description: "",
    brand: "",
    serialNumber: "",
    supplier: "",
    unitCost: 0,
    totalCost: 0,
    datePurchased: "",
    dateRecieved: "",
    location: "",
    department: "",
    serviceRequestId: "",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await fetchCreateEquipment(
        formData.description,
        formData.brand,
        formData.serialNumber,
        formData.supplier,
        formData.unitCost,
        formData.totalCost,
        new Date(formData.datePurchased),
        new Date(formData.dateRecieved),
        formData.location,
        formData.department,
        formData.serviceRequestId
      );
    } catch (error) {
      console.error("Failed to create equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
          </div>
          {/* diri butang ang other details sang equipment */}
          <div>
          <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: (e.target.value) })
              }
            />
          </div>
          <div>
          <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: (e.target.value) })
              }
            />
          </div>
          <div>
          <Label htmlFor="unitCost">Unit Cost</Label>
            <Input
              id="unitCost"
              value={formData.unitCost}
              onChange={(e) =>
                setFormData({ ...formData, unitCost: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
          <Label htmlFor="totalCost">Total Cost</Label>
            <Input
              id="totalCost"
              value={formData.totalCost}
              onChange={(e) =>
                setFormData({ ...formData, totalCost: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
          <Label htmlFor="datePurchased">Date Purchased</Label>
            <Input
              id="datePurchased"
              type = "date"
              value={formData.datePurchased}
              onChange={(e) =>
                setFormData({ ...formData, datePurchased: (e.target.value) })
              }
            />
          </div>
          <div>
          <Label htmlFor="dateRecieved">Date Recieved</Label>
            <Input
              id="dateRecieved"
              type = "date"
              value={formData.dateRecieved}
              onChange={(e) =>
                setFormData({ ...formData, dateRecieved: (e.target.value) })
              }
            />
          </div>
          <div>
          <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: (e.target.value) })
              }
            />
          </div>
          <div>
          <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: (e.target.value) })
              }
            />
          </div>
        </div>

        <Separator className="my-4" />

        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}
