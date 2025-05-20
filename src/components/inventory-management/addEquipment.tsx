"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/inventory-management/services/fetchCreateEquipment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    setFormData(prev => ({ ...prev, totalCost: Number(total.toFixed(2)) }));
  }, [formData.quantity, formData.unitCost]);

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  [
    "description",
    "brand",
    "serialNumber",
    "supplier",
    "location",
    "department",
  ].forEach(key => {
    const val = formData[key as keyof EquipmentFormData] as string;
    if (!val.trim()) newErrors[key as keyof EquipmentFormData] = "This field is required.";
  });
  if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
  if (formData.unitCost < 0) newErrors.unitCost = "Unit cost cannot be negative";
  if (formData.unitCost === 0) newErrors.unitCost = "Unit cost cannot be zero";
  const today = new Date();
  const purchase = new Date(formData.datePurchased);
  const receive = new Date(formData.dateReceived);
  if (purchase > today) newErrors.datePurchased = "Purchase date cannot be in the future";
  if (receive > today) newErrors.dateReceived = "Receive date cannot be in the future";
  if (receive < purchase) newErrors.dateReceived = "Receive date cannot be before purchase date";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof EquipmentFormData
  ) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: ["quantity", "unitCost"].includes(field)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleStatusChange = (value: EquipmentStatus) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await fetchCreateEquipment({
        ...{
          ...formData,
          datePurchased: new Date(formData.datePurchased),
          dateReceived: new Date(formData.dateReceived),
        },
      });
      onSuccess?.();
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete =
    formData.description.trim() &&
    formData.brand.trim() &&
    formData.serialNumber.trim() &&
    formData.supplier.trim() &&
    formData.location.trim() &&
    formData.department.trim() &&
    formData.quantity > 0 &&
    formData.unitCost >= 0 &&
    new Date(formData.datePurchased) <= new Date();

  const todayISO = new Date().toISOString().split("T")[0];

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
            { id: "unitCost", label: "Unit Cost", type: "number", min: 0 },
            { id: "totalCost", label: "Total Cost", type: "number", disabled: true },
            { id: "datePurchased", label: "Date Purchased", type: "date", max: todayISO },
            { id: "dateReceived", label: "Date Received", type: "date", max: todayISO },
            { id: "location", label: "Location", type: "text" },
            { id: "department", label: "Department", type: "text" },
          ].map(({ id, label, type, ...props }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label} *</Label>
              <Input
                id={id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type={type as any}
                value={String(formData[id as keyof EquipmentFormData])}
                onChange={e => handleInputChange(e as ChangeEvent<HTMLInputElement>, id as keyof EquipmentFormData)}
                maxLength={type === "text" ? TEXT_MAX[id as keyof typeof TEXT_MAX] : undefined}
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

          {/* Status field using shadcn select */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {( ["Operational", "Repairable", "Scrap"] as EquipmentStatus[] ).map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!isComplete || isLoading}
        >
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}
