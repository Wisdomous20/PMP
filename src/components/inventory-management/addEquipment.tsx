"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createEquipment } from "@/lib/equipments/create-equipment";
import type { EquipmentFormData } from "@/lib/types/InventoryManagementTypes";
import { ErrorCodes } from "@/lib/ErrorCodes";
import * as FormValidator from "@/components/inventory-management/commons/FormValidator";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OFFICES } from "@/lib/constants/EquipmentPageConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface AddEquipmentProps {
  serviceRequestId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  supervisorDepartment?: string; // Added prop
}

type EquipmentStatus = "Operational" | "Repairable" | "Scrap";
type FormErrors = Partial<Record<keyof EquipmentFormData, string>>;

const TEXT_MAX = {
  description: 255,
  brand: 128,
  serialNumber: 128,
  supplier: 128,
  location: 128,
  department: 128,
};

export default function AddEquipment({
  serviceRequestId,
  onSuccess,
  onError,
  supervisorDepartment, // Destructure the new prop
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
    department: supervisorDepartment || "", // Pre-fill department if supervisorDepartment is provided
    serviceRequestId: serviceRequestId || null,
  });
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData((prev) => ({ ...prev, totalCost: Number(total.toFixed(2)) }));
  }, [formData.quantity, formData.unitCost]);

  useEffect(() => {
    FormValidator.validate(formData, supervisorDepartment)
      .then(r => {
        setIsComplete(r.ok);
      });
  }, [formData, supervisorDepartment]);

  // If supervisorDepartment changes (e.g., a parent component re-renders with a new prop), update formData
  // This is more relevant if the dialog could remain open while props change.
  useEffect(() => {
    if (supervisorDepartment) {
      setFormData((prev) => ({ ...prev, department: supervisorDepartment }));
    }
  }, [supervisorDepartment]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof EquipmentFormData
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: ["quantity", "unitCost"].includes(field)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleStatusChange = (value: EquipmentStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleDepartmentChange = (value: string) => {
    // Only allow change if not pre-filled by a supervisor
    if (!supervisorDepartment) {
      setFormData((prev) => ({ ...prev, department: value }));
    }
  };

  const handleSubmit = async () => {
    // Validation Before Submission
    const validate = await FormValidator.validate(formData, supervisorDepartment);
    if (!validate.ok) {
      const newErrors: FormErrors = {};

      if (Object.keys(validate.errors).length > 0) {
        for (const e of Object.keys(validate.errors)) {
          newErrors[e as keyof EquipmentFormData] = validate.errors[e as keyof EquipmentFormData].message;
        }
      }

      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Create the equipment
    const result = await createEquipment({
      ...formData,
      datePurchased: new Date(formData.datePurchased),
      dateReceived: new Date(formData.dateReceived),
    });

    // Creation Failure
    if (result.code !== ErrorCodes.OK) {
      onError?.(new Error(result.message));
      setIsLoading(false);

      return;
    }

    onSuccess?.();
    setIsLoading(false);
  };

  const todayISO = new Date().toISOString().split("T")[0];
  const isDepartmentDisabled = !!supervisorDepartment;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "description", label: "Description", type: "text" },
            { id: "brand", label: "Brand", type: "text" },
            { id: "serialNumber", label: "Serial Number", type: "text" },
            { id: "supplier", label: "Supplier", type: "text" },
            { id: "quantity", label: "Quantity", type: "number", min: 1 },
            { id: "unitCost", label: "Unit Cost", type: "number", min: 0, step: "0.01" },
            {
              id: "totalCost",
              label: "Total Cost",
              type: "number",
              disabled: true,
              step: "0.01",
            },
            {
              id: "datePurchased",
              label: "Date Purchased",
              type: "date",
              max: todayISO,
            },
            {
              id: "dateReceived",
              label: "Date Received",
              type: "date",
              max: todayISO,
            },
            { id: "location", label: "Location", type: "text" },
          ].map(({ id, label, type, ...props }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label} *</Label>
              <Input
                id={id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type={type as any}
                value={String(formData[id as keyof EquipmentFormData])}
                onChange={(e) =>
                  handleInputChange(
                    e as ChangeEvent<HTMLInputElement>,
                    id as keyof EquipmentFormData
                  )
                }
                maxLength={
                  type === "text"
                    ? TEXT_MAX[id as keyof typeof TEXT_MAX]
                    : undefined
                }
                className={
                  errors[id as keyof EquipmentFormData] ? "border-red-500" : ""
                }
                {...props}
              />
              {errors[id as keyof EquipmentFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[id as keyof EquipmentFormData]}
                </p>
              )}
            </div>
          ))}

          {/* Status field using shadcn select */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {(
                  ["Operational", "Repairable", "Scrap"] as EquipmentStatus[]
                ).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="hover:cursor-pointer border border-transparent hover:border-gray-800"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          {/* Department (Office) Field */}
          <div className="space-y-2">
            <Label htmlFor="department">Office *</Label>
            <Select
              value={formData.department}
              onValueChange={handleDepartmentChange}
              disabled={isDepartmentDisabled} // Disable if supervisorDepartment is present
            >
              <SelectTrigger id="department" disabled={isDepartmentDisabled}>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>

              <SelectContent>
                {/* If disabled and pre-filled, only show that option or all if not disabled */}
                {isDepartmentDisabled && formData.department ? (
                    <SelectItem value={formData.department} disabled>
                        {formData.department}
                    </SelectItem>
                ) : (
                    OFFICES.map((office) => (
                    <SelectItem
                        key={office}
                        value={office}
                        className="hover:cursor-pointer border border-transparent hover:border-gray-800"
                    >
                        {office}
                    </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>

            {errors.department && (
              <p className="text-red-500 text-sm mt-1">{errors.department}</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <Button
          onClick={handleSubmit}
          className="w-full bg-indigo-700 hover:bg-indigo-900"
          disabled={!isComplete || isLoading}
        >
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}
