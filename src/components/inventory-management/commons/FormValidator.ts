import {DateTime} from "luxon";
import type {EquipmentFormData, EquipmentObjectForEditing} from "@/lib/types/InventoryManagementTypes";
import validator, {type ValidationResult} from "@/lib/validators";

export async function validate(
  data: EquipmentFormData,
  supervisorDepartment: string | undefined
): Promise<ValidationResult<EquipmentFormData>> {
  return await validator.validate(data, {
    properties: {
      description: {type: "string", formatter: "non-empty-string"},
      brand: {type: "string", formatter: "non-empty-string"},
      serialNumber: {type: "string", formatter: "non-empty-string"},
      supplier: {type: "string", formatter: "non-empty-string"},
      location: {type: "string", formatter: "non-empty-string"},
      department: {type: "string", formatter: "non-empty-string"},

      totalCost: {type: "number"},
      status: {type: "string", formatter: "non-empty-string"},

      quantity: {type: "number", min: 1},
      unitCost: {
        type: "number",
        formatterFn: async (x) => {
          if (x === 0 && data.status === "Scrap") {
            return {ok: true};
          }

          if (x <= 0) {
            return {
              ok: false,
              error: "Unit cost must be greater than or equal to 1 unless the status is Scrap."
            }
          }

          return {ok: true}
        }
      },

      datePurchased: {
        type: "date",
        min: DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      },
      dateReceived: {
        type: "date",
        min: DateTime.fromISO(data.datePurchased),
        max: DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      }
    },
    requiredProperties: [
      "description",
      "brand",
      "serialNumber",
      "supplier",
      "location",
      "quantity",
      "unitCost",
      "datePurchased",
      "dateReceived",
      "totalCost",
      "status",

      // Department validation only if not pre-filled by a supervisor
      ...(supervisorDepartment ? ["department"]: []) as Array<keyof EquipmentFormData>
    ],
    allowUnvalidatedProperties: true
  });
}

export async function validateForEditing(
  data: EquipmentObjectForEditing,
  supervisorDepartment: string | undefined
): Promise<ValidationResult<EquipmentObjectForEditing>> {
  return await validator.validate(data, {
    properties: {
      description: {type: "string", formatter: "non-empty-string"},
      brand: {type: "string", formatter: "non-empty-string"},
      serialNumber: {type: "string", formatter: "non-empty-string"},
      supplier: {type: "string", formatter: "non-empty-string"},
      location: {type: "string", formatter: "non-empty-string"},
      department: {type: "string", formatter: "non-empty-string"},

      totalCost: {type: "number"},
      status: {type: "string", formatter: "non-empty-string"},

      quantity: {type: "number", min: 1},
      unitCost: {
        type: "number",
        formatterFn: async (x) => {
          if (x === 0 && data.status === "Scrap") {
            return {ok: true};
          }

          if (x <= 0) {
            return {
              ok: false,
              error: "Unit cost must be greater than or equal to 1 unless the status is Scrap."
            }
          }

          return {ok: true}
        }
      },

      datePurchased: {
        type: "date",
        min: DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      },
      dateReceived: {
        type: "date",
        min: DateTime.fromISO(data.datePurchased),
        max: DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}),
      }
    },

    requiredProperties: [
      "description",
      "brand",
      "serialNumber",
      "supplier",
      "location",

      // Department validation only if not pre-filled by a supervisor
      ...(supervisorDepartment ? ["department"]: []) as Array<keyof EquipmentObjectForEditing>,
    ],

    allowUnvalidatedProperties: true
  });
}
