"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

export default function AddEquipment() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
        </div>

        <Separator className="my-4" />

        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}
