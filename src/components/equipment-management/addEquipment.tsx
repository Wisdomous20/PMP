// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { EquipmentStatus } from "@/domains/equipment-management/types/equipmentType";
// import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

// export default function AddEquipment() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     qty: 0,
//     description: "",
//     brand: "",
//     serialNumber: "",
//     supplier: "",
//     unitCost: 0,
//     totalCost: 0,
//     datePurchased: "",
//     dateRecieved: "",
//     location: "",
//     department: "",
//     serviceRequestId: "",
//   });

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       await fetchCreateEquipment(
//         formData.description,
//         formData.brand,
//         formData.serialNumber,
//         formData.supplier,
//         formData.unitCost,
//         formData.totalCost,
//         new Date(formData.datePurchased),
//         new Date(formData.dateRecieved),
//         formData.location,
//         formData.department,
//         formData.serviceRequestId
//       );
//     } catch (error) {
//       console.error("Failed to create equipment:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Input
//               id="description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Label htmlFor="brand">Brand</Label>
//             <Input
//               id="brand"
//               value={formData.brand}
//               onChange={(e) =>
//                 setFormData({ ...formData, brand: e.target.value })
//               }
//             />
//           </div>
//           {/* diri butang ang other details sang equipment */}
//           <div>
//           <Label htmlFor="qty">Quantity</Label>
//             <Input
//               id="qty"
//               value={formData.qty}
//               onChange={(e) =>
//                 setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="serialNumber">Serial Number</Label>
//             <Input
//               id="serialNumber"
//               value={formData.serialNumber}
//               onChange={(e) =>
//                 setFormData({ ...formData, serialNumber: (e.target.value) })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="supplier">Supplier</Label>
//             <Input
//               id="supplier"
//               value={formData.supplier}
//               onChange={(e) =>
//                 setFormData({ ...formData, supplier: (e.target.value) })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="unitCost">Unit Cost</Label>
//             <Input
//               id="unitCost"
//               value={formData.unitCost}
//               onChange={(e) =>
//                 setFormData({ ...formData, unitCost: parseInt(e.target.value) || 0 })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="totalCost">Total Cost</Label>
//             <Input
//               id="totalCost"
//               value={formData.totalCost}
//               onChange={(e) =>
//                 setFormData({ ...formData, totalCost: parseInt(e.target.value) || 0 })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="datePurchased">Date Purchased</Label>
//             <Input
//               id="datePurchased"
//               type = "date"
//               value={formData.datePurchased}
//               onChange={(e) =>
//                 setFormData({ ...formData, datePurchased: (e.target.value) })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="dateRecieved">Date Recieved</Label>
//             <Input
//               id="dateRecieved"
//               type = "date"
//               value={formData.dateRecieved}
//               onChange={(e) =>
//                 setFormData({ ...formData, dateRecieved: (e.target.value) })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="location">Location</Label>
//             <Input
//               id="location"
//               value={formData.location}
//               onChange={(e) =>
//                 setFormData({ ...formData, location: (e.target.value) })
//               }
//             />
//           </div>
//           <div>
//           <Label htmlFor="department">Department</Label>
//             <Input
//               id="department"
//               value={formData.department}
//               onChange={(e) =>
//                 setFormData({ ...formData, department: (e.target.value) })
//               }
//             />
//           </div>
//         </div>

//         <Separator className="my-4" />

//         <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
//           {isLoading ? "Creating..." : "Create Equipment"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import fetchCreateEquipment from "@/domains/equipment-management/services/fetchCreateEquipment";

// Define types for form data
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
    let newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof EquipmentFormData];

      if (!value || value === 0) {
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
