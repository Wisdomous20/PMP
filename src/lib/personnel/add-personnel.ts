"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes"
import {GenericFailureType} from "@/lib/types/GenericFailureType";
import validator from "@/lib/validators";

interface PersonnelInfo {
  name: string;
  department: string;
  position: string;
}

interface PersonnelResult extends GenericFailureType {
  data?: PersonnelInfo;
}

export async function addPersonnel(personnel: PersonnelInfo): Promise<PersonnelResult> {
  const validation = await validator.validate(personnel, {
    properties: {
      name: {type: "string", formatter: "non-empty-string"},
      department: {type: "string", formatter: "non-empty-string"},
      position: {type: "string", formatter: "non-empty-string"}
    },
    requiredProperties: ["name", "department", "position"],
  });
  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }

  const newEmployee = await client.personnel.create({
    data: {
      name: personnel.name,
      department: personnel.department,
      position: personnel.position,
    },
  });

  return {
    code: ErrorCodes.OK,
    data: newEmployee,
  };
}
