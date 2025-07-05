'use server';

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface PersonnelResult extends GenericFailureType {
  data?: {
    id: string;
    name: string;
    department: string;
    position: string;
  }
}

export async function updatePersonnel(
  id: string, name: string, department: string, position: string
): Promise<PersonnelResult> {
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