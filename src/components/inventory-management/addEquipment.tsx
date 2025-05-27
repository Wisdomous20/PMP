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

const OFFICES = [
  "Buildings Upkeep and Maintenance",
  "Campus Traffic",
  "Security and Safety",
  "Electrical & Mechanical Systems",
  "Facilities Maintenance and Services",
  "Grounds Upkeep and Maintenance",
  "Occupational Safety and Health Officer",
  "Pollution Control",
  "Swimming Pool",
  "University Computer Services Center",
];

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

  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData((prev) => ({ ...prev, totalCost: Number(total.toFixed(2)) }));
  }, [formData.quantity, formData.unitCost]);

  // If supervisorDepartment changes (e.g. parent component re-renders with new prop), update formData
  // This is more relevant if the dialog could remain open while props change.
  useEffect(() => {
    if (supervisorDepartment) {
      setFormData((prev) => ({ ...prev, department: supervisorDepartment }));
    }
  }, [supervisorDepartment]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    [
      "description",
      "brand",
      "serialNumber",
      "supplier",
      "location",
      "department",
    ].forEach((key) => {
      const val = formData[key as keyof EquipmentFormData] as string;
      if (!val.trim())
        newErrors[key as keyof EquipmentFormData] = "This field is required.";
    });
    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.unitCost < 0)
      newErrors.unitCost = "Unit cost cannot be negative";
    if (formData.unitCost === 0 && formData.status !== "Scrap") // Allow zero cost for scrap items potentially
      newErrors.unitCost = "Unit cost cannot be zero unless status is Scrap.";
    const today = new Date();
    today.setHours(0,0,0,0); // Compare dates only
    const purchase = new Date(formData.datePurchased);
    const receive = new Date(formData.dateReceived);

    if (purchase > today)
      newErrors.datePurchased = "Purchase date cannot be in the future";
    if (receive > today)
      newErrors.dateReceived = "Receive date cannot be in the future";
    if (receive < purchase)
      newErrors.dateReceived = "Receive date cannot be before purchase date";
    
    // Department validation should only occur if it's not pre-filled by supervisor
    if (!supervisorDepartment && !formData.department.trim()) {
        newErrors.department = "This field is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    // Only allow change if not pre-filled by supervisor
    if (!supervisorDepartment) {
      setFormData((prev) => ({ ...prev, department: value }));
    }
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
    (supervisorDepartment ? true : formData.department.trim()) && // Department must be valid
    formData.quantity > 0 &&
    formData.unitCost >= 0 &&
    (formData.unitCost > 0 || formData.status === "Scrap") && // Ensure unit cost is > 0 unless scrap
    new Date(formData.datePurchased) <= new Date() &&
    new Date(formData.dateReceived) >= new Date(formData.datePurchased) &&
    new Date(formData.dateReceived) <= new Date();

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
          className="w-full bg-indigo-Background hover:bg-indigo-900"
          disabled={!isComplete || isLoading}
        >
          {isLoading ? "Creating..." : "Create Equipment"}
        </Button>
      </CardContent>
    </Card>
  );
}