"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

interface EquipmentFormData {
  qty: number;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
  datePurchased: string;
  dateRecieved: string;
  location: string;
  department: string;
  serviceRequestId: string;
}

type FormErrors = Partial<Record<keyof EquipmentFormData, string>>;

export default function AddEquipment() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EquipmentFormData>({
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof EquipmentFormData];

      if (
        !value &&
        value !== 0 &&
        !["qty", "unitCost", "totalCost"].includes(key)
      ) {
        newErrors[key as keyof EquipmentFormData] = "This field is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
          {[
            { id: "description", label: "Description", type: "text" },
            { id: "brand", label: "Brand", type: "text" },
            { id: "qty", label: "Quantity", type: "number" },
            { id: "serialNumber", label: "Serial Number", type: "text" },
            { id: "supplier", label: "Supplier", type: "text" },
            { id: "unitCost", label: "Unit Cost", type: "number" },
            { id: "totalCost", label: "Total Cost", type: "number" },
            { id: "datePurchased", label: "Date Purchased", type: "date" },
            { id: "dateRecieved", label: "Date Received", type: "date" },
            { id: "location", label: "Location", type: "text" },
            { id: "department", label: "Department", type: "text" },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type={type}
                value={formData[id as keyof EquipmentFormData].toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [id]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value,
                  })
                }
              />
              {errors[id as keyof EquipmentFormData] && (
                <p className="text-red-500 text-sm">{errors[id as keyof EquipmentFormData]}</p>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}
