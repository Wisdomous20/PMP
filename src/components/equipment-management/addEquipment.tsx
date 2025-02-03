"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

interface EquipmentFormData {
  quantity: number;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
  datePurchased: string;
  dateReceived: string;
  location: string;
  department: string;
  serviceRequestId: string;
}

interface AddEquipmentProps {
  serviceRequestId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type FormErrors = Partial<Record<keyof EquipmentFormData, string>>;

export default function AddEquipment({ 
  serviceRequestId, 
  onSuccess, 
  onError 
}: AddEquipmentProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EquipmentFormData>({
    quantity: 1,
    description: "",
    brand: "",
    serialNumber: "",
    supplier: "",
    unitCost: 0,
    totalCost: 0,
    datePurchased: new Date().toISOString().split('T')[0],
    dateReceived: new Date().toISOString().split('T')[0],
    location: "",
    department: "",
    serviceRequestId,
  });

  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData(prev => ({
      ...prev,
      totalCost: Number(total.toFixed(2))
    }));
  }, [formData.quantity, formData.unitCost]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check all fields are filled
    Object.entries(formData).forEach(([key, value]) => {
      if (value === "" || value === 0 || value === null || value === undefined) {
        newErrors[key as keyof EquipmentFormData] = "This field is required.";
      }
    });

    // Additional validations
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.unitCost < 0) {
      newErrors.unitCost = "Unit cost cannot be negative";
    }

    const purchaseDate = new Date(formData.datePurchased);
    const receiveDate = new Date(formData.dateReceived);
    const today = new Date();

    if (purchaseDate > today) {
      newErrors.datePurchased = "Purchase date cannot be in the future";
    }

    if (receiveDate > today) {
      newErrors.dateReceived = "Receive date cannot be in the future";
    }

    if (receiveDate < purchaseDate) {
      newErrors.dateReceived = "Receive date cannot be before purchase date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof EquipmentFormData
  ) => {
    const value = e.target.value;
    const numberFields = ["quantity", "unitCost"];
    
    setFormData(prev => ({
      ...prev,
      [field]: numberFields.includes(field) ? 
        (Number(value) || 0) : 
        value
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await fetchCreateEquipment({
        ...formData,
        datePurchased: new Date(formData.datePurchased),
        dateReceived: new Date(formData.dateReceived),
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create equipment:", error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { id: "description", label: "Description", type: "text", required: true },
    { id: "brand", label: "Brand", type: "text", required: true },
    { id: "quantity", label: "Quantity", type: "number", min: "1", required: true },
    { id: "serialNumber", label: "Serial Number", type: "text", required: true },
    { id: "supplier", label: "Supplier", type: "text", required: true },
    { id: "unitCost", label: "Unit Cost", type: "number", min: "0", step: "1", required: true },
    { id: "totalCost", label: "Total Cost", type: "number", disabled: true },
    { id: "datePurchased", label: "Date Purchased", type: "date", required: true },
    { id: "dateReceived", label: "Date Received", type: "date", required: true },
    { id: "location", label: "Location", type: "text", required: true },
    { id: "department", label: "Department", type: "text", required: true },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {formFields.map(({ id, label, type, ...props }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label} *</Label>
              <Input
                id={id}
                type={type}
                value={formData[id as keyof EquipmentFormData]?.toString()}
                onChange={(e) => handleInputChange(e, id as keyof EquipmentFormData)}
                className={errors[id as keyof EquipmentFormData] ? "border-red-500" : ""}
                {...props}
              />
              {errors[id as keyof EquipmentFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[id as keyof EquipmentFormData]}
                </p>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}