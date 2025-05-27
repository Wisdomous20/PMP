"use client";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchUpdateEquipment from "@/domains/inventory-management/services/fetchUpdateEquipment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";

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

interface Equipment {
  id: string;
  quantity: number;
  description: string;
  brand: string;
  serialNumber: string;
  supplier: string;
  unitCost: number;
  totalCost: number;
  datePurchased: string;
  dateReceived: string;
  status: EquipmentStatus;
  location: string;
  department: string;
}

interface EditEquipmentDialogProps {
  equipment: Equipment;
  onUpdate: () => void;
  onError?: (error: Error) => void;
}

type EquipmentInput = Omit<Equipment, "id" | "totalCost"> & {
  totalCost: number;
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
  onUpdate,
  onError,
}: EditEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EquipmentInput>({
    quantity: equipment.quantity,
    description: equipment.description,
    brand: equipment.brand,
    serialNumber: equipment.serialNumber,
    supplier: equipment.supplier,
    unitCost: equipment.unitCost,
    totalCost: equipment.totalCost,
    datePurchased: new Date(equipment.datePurchased)
      .toISOString()
      .split("T")[0],
    dateReceived: new Date(equipment.dateReceived).toISOString().split("T")[0],
    status: equipment.status,
    location: equipment.location,
    department: equipment.department,
  });

  // sync totalCost
  useEffect(() => {
    const total = formData.quantity * formData.unitCost;
    setFormData((prev) => ({
      ...prev,
      totalCost: Number(total.toFixed(2)),
    }));
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
    ].forEach((key) => {
      const val = String(formData[key as keyof EquipmentInput] || "");
      if (!val.trim())
        newErrors[key as keyof EquipmentInput] = "This field is required.";
    });
    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.unitCost < 0)
      newErrors.unitCost = "Unit cost cannot be negative";
    const today = new Date().toISOString().split("T")[0];
    if (formData.datePurchased > today)
      newErrors.datePurchased = "Purchase date cannot be in the future";
    if (formData.dateReceived > today)
      newErrors.dateReceived = "Receive date cannot be in the future";
    if (formData.dateReceived < formData.datePurchased)
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

  const handleStatusChange = (value: EquipmentStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setIsUpdating(true);
    try {
      await fetchUpdateEquipment(equipment.id, {
        ...formData,
        datePurchased: new Date(formData.datePurchased),
        dateReceived: new Date(formData.dateReceived),
      });
      onUpdate();
      setIsOpen(false);
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsUpdating(false);
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
    formData.datePurchased <= new Date().toISOString().split("T")[0];

  const todayISO = new Date().toISOString().split("T")[0];

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
                { id: "unitCost", label: "Unit Cost", type: "number", min: 0 },
                {
                  id: "totalCost",
                  label: "Total Cost",
                  type: "number",
                  disabled: true,
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
                    {(
                      [
                        "Operational",
                        "Repairable",
                        "Scrap",
                      ] as EquipmentStatus[]
                    ).map((s) => (
                      <SelectItem
                        key={s}
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
              <div className="space-y-2">
                <Label htmlFor="department">Office *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>

                  <SelectContent>
                    {OFFICES.map((office) => (
                      <SelectItem
                        key={office}
                        value={office}
                        className="hover:cursor-pointer border border-transparent hover:border-gray-800"
                      >
                        {office}
                      </SelectItem>
                    ))}
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
