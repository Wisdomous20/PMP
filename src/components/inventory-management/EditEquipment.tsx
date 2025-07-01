"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import * as equipmentManager from "@/lib/equipments/update-equipment";
import {type EquipmentObject, type EquipmentObjectForEditing} from "@/lib/types/InventoryManagementTypes";
import * as helpers from "@/lib/types/InventoryManagementTypesHelpers";
import {ChangeEvent, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {OFFICES} from "@/lib/constants/EquipmentPageConstants";
import {Pencil} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {ErrorCodes} from "@/lib/ErrorCodes";

interface EditEquipmentDialogProps {
  equipment: EquipmentObject;
  onUpdateAction: () => void;
  onError?: (error: Error) => void;
  supervisorDepartment?: string; // Added prop
}

type EquipmentInput = Omit<Equipment, "id" | "totalCost"> & {
  totalCost: number; // totalCost is part of EquipmentInput now
};

type FormErrors = Partial<Record<keyof EquipmentInput, string>>;

const TEXT_MAX = {
  description: 255,
  brand: 128,
  serialNumber: 128,
  supplier: 128,
  location: 128,
  department: 128,
};

export function EditEquipment({
  equipment,
  onUpdateAction,
  onError,
  supervisorDepartment, // Destructure the new prop
}: EditEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const initializeFormData = (): EquipmentObjectForEditing => ({
    quantity: equipment.quantity,
    description: equipment.description,
    brand: equipment.brand,
    serialNumber: equipment.serialNumber,
    supplier: equipment.supplier,
    unitCost: equipment.unitCost,
    totalCost: equipment.totalCost, // Will be recalculated by useEffect
    datePurchased: equipment.datePurchased
      .toISOString()
      .split("T")[0],
    dateReceived: equipment.dateReceived
      .toISOString()
      .split("T")[0],
    status: helpers.equipmentObjectStatusToString(equipment.status),
    location: equipment.location,
    // If a supervisorDepartment is provided, use it; otherwise, use equipment's current department.
    department: supervisorDepartment || equipment.department,
  });

  const [formData, setFormData] = useState<EquipmentObjectForEditing>(initializeFormData());

  // Recalculate totalCost when quantity or unitCost changes
  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData((prev) => ({
      ...prev,
      totalCost: Number(total.toFixed(2)),
    }));
  }, [formData.quantity, formData.unitCost]);

  // Reset form data when the dialog opens/equipment prop changes, and apply supervisorDepartment
  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: equipment.quantity,
        description: equipment.description,
        brand: equipment.brand,
        serialNumber: equipment.serialNumber,
        supplier: equipment.supplier,
        unitCost: equipment.unitCost,
        totalCost: equipment.totalCost,
        datePurchased: new Date(equipment.datePurchased).toISOString().split("T")[0],
        dateReceived: new Date(equipment.dateReceived).toISOString().split("T")[0],
        status: helpers.equipmentObjectStatusToString(equipment.status),
        location: equipment.location,
        department: supervisorDepartment || equipment.department,
      });
      setErrors({}); // Clear previous errors
    }
  }, [isOpen, equipment, supervisorDepartment]);


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    [
      "description",
      "brand",
      "serialNumber",
      "supplier",
      "location",
    ].forEach((key) => {
      const val = String(formData[key as keyof EquipmentInput] || "");
      if (!val.trim())
        newErrors[key as keyof EquipmentInput] = "This field is required.";
    });

    // Department validation only if not pre-filled by a supervisor
    if (!supervisorDepartment && !(formData.department || "").trim()) {
        newErrors.department = "This field is required.";
    }

    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.unitCost < 0)
      newErrors.unitCost = "Unit cost cannot be negative";
    
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof EquipmentInput
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: ["quantity", "unitCost"].includes(field)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleDepartmentChange = (value: string) => {
    // Only allow change if not pre-filled by a supervisor
    if (!supervisorDepartment) {
      setFormData((prev) => ({ ...prev, department: value }));
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setIsUpdating(true);

    const result = await equipmentManager.updateEquipment({
      ...formData,
      id: equipment.id,
      datePurchased: new Date(formData.datePurchased),
      dateReceived: new Date(formData.dateReceived),
      status: helpers.toEquipmentObjectStatus(formData.status),
    });

    // Don't close.
    if (result.code !== ErrorCodes.OK) {
      onError?.(new Error(result.message));
      return;
    }

    onUpdateAction();
    setIsOpen(false);
    setIsUpdating(false);
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
    formData.datePurchased <= new Date().toISOString().split("T")[0] &&
    formData.dateReceived >= formData.datePurchased &&
    formData.dateReceived <= new Date().toISOString().split("T")[0];

  const todayISO = new Date().toISOString().split("T")[0];
  const isDepartmentDisabled = !!supervisorDepartment;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-white transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4 text-black" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* fields */}
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
                    value={String(formData[id as keyof EquipmentInput])}
                    onChange={(e) =>
                      handleInputChange(
                        e as ChangeEvent<HTMLInputElement>,
                        id as keyof EquipmentInput
                      )
                    }
                    maxLength={
                      type === "text"
                        ? TEXT_MAX[id as keyof typeof TEXT_MAX]
                        : undefined
                    }
                    className={
                      errors[id as keyof EquipmentInput] ? "border-red-500" : ""
                    }
                    {...props}
                  />
                  {errors[id as keyof EquipmentInput] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[id as keyof EquipmentInput]}
                    </p>
                  )}
                </div>
              ))}

              {/* status */}
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
                    {(["Operational", "Repairable", "Scrap",]).map((s, i) => (
                      <SelectItem
                        key={i}
                        value={s}
                        className="hover:cursor-pointer border border-transparent hover:border-gray-800"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            <Button
              onClick={handleUpdate}
              className="w-full"
              disabled={!isComplete || isUpdating}
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
