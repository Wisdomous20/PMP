"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/inventory-management/services/fetchCreateEquipment";

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
  status: EquipmentStatus;
  serviceRequestId?: string | null;
}
interface AddEquipmentProps {
  serviceRequestId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type FormErrors = Partial<Record<keyof EquipmentFormData, string>>;

export default function AddEquipment({
  serviceRequestId,
  onSuccess,
  onError,
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
    datePurchased: new Date().toISOString().split("T")[0],
    dateReceived: new Date().toISOString().split("T")[0],
    location: "",
    status: "Operational",
    department: "",
    serviceRequestId: serviceRequestId || null,
  });

  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData((prev) => ({
      ...prev,
      totalCost: Number(total.toFixed(2)),
    }));
  }, [formData.quantity, formData.unitCost]);

  useEffect(() => {
    console.log("Current status:", formData.status);
  }, [formData.status]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const requiredFields = Object.entries(formData).filter(
      ([key]) => key !== "serviceRequestId"
    );

    requiredFields.forEach(([key, value]) => {
      if (
        value === "" ||
        value === 0 ||
        value === null ||
        value === undefined
      ) {
        newErrors[key as keyof EquipmentFormData] = "This field is required.";
      }
    });

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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof EquipmentFormData
  ) => {
    const value = e.target.value;

    const numberFields = ["quantity", "unitCost"];
    setFormData((prev) => ({
      ...prev,
      [field]: numberFields.includes(field) ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        datePurchased: new Date(formData.datePurchased),
        dateReceived: new Date(formData.dateReceived),
      };
      console.log("Submitting data:", submitData);

      await fetchCreateEquipment(submitData);
      console.log("Equipment created successfully");
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
    {
      id: "quantity",
      label: "Quantity",
      type: "number",
      min: "1",
      required: true,
    },
    {
      id: "serialNumber",
      label: "Serial Number",
      type: "text",
      required: true,
    },
    { id: "supplier", label: "Supplier", type: "text", required: true },
    {
      id: "unitCost",
      label: "Unit Cost",
      type: "number",
      min: "0",
      step: "1",
      required: true,
    },
    { id: "totalCost", label: "Total Cost", type: "number", disabled: true },
    {
      id: "datePurchased",
      label: "Date Purchased",
      type: "date",
      required: true,
    },
    {
      id: "dateReceived",
      label: "Date Received",
      type: "date",
      required: true,
    },
    { id: "location", label: "Location", type: "text", required: true },
    { id: "department", label: "Department", type: "text", required: true },
    {
      id: "status",
      label: "Status",
      type: "select",
      required: true,
      options: ["Operational", "Repairable", "Scrap"],
    },
  ];

  const TEXT_FIELD_MAX_LENGTH = 500;


  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {formFields.map(({ id, label, type, options, ...props }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label} *</Label>
              {type === "select" ? (
                <select
                  id={id}
                  value={formData[id as keyof EquipmentFormData] as string}
                  onChange={(e) =>
                    handleInputChange(e, id as keyof EquipmentFormData)
                  }
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors[id as keyof EquipmentFormData]
                      ? "border-red-500"
                      : ""
                  }`}
                  {...props}
                >
                  {options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={id}
                  type={type}
                  value={formData[id as keyof EquipmentFormData]?.toString()}
                  onChange={(e) =>
                    handleInputChange(e, id as keyof EquipmentFormData)
                  }
                  maxLength={type === "text" ? TEXT_FIELD_MAX_LENGTH : undefined}
                  className={
                    errors[id as keyof EquipmentFormData]
                      ? "border-red-500"
                      : ""
                  }
                  {...props}
                />
              )}
              {errors[id as keyof EquipmentFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[id as keyof EquipmentFormData]}
                </p>
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
