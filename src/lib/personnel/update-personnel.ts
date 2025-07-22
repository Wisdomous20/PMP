"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import validator from "@/lib/validators";

interface PersonnelResult extends GenericFailureType {
  data?: {
    id: string;
    name: string;
    department: string;
    position: string;
  }
}

export async function updatePersonnel(id: string, name: string, department: string, position: string): Promise<PersonnelResult> {
  const validation = await validator.validate({ id, name, department, position }, {
    properties: {
      id: {type: "string", formatter: "non-empty-string"},
      name: {type: "string", formatter: "non-empty-string"},
      department: {type: "string", formatter: "non-empty-string"},
      position: {type: "string", formatter: "non-empty-string"}
    },
    requiredProperties: ["id", "name", "department", "position"],
  });
  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }
  const updatedPersonnel = await client.personnel.update({
    where: { id },
    data: {
      name,
      department,
      position,
    },
  });

  return {
    code: ErrorCodes.OK,
    data: updatedPersonnel
  };
}
