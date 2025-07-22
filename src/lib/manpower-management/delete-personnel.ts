"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes"
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface PersonnelResult extends GenericFailureType {
  data?: {
    name: string;
    id: string;
    department: string;
    position: string;
  }
}

export async function deletePersonnel(personnelId: string): Promise<PersonnelResult> {
  const personnel = await client.personnel.delete({
    where: { id: personnelId },
  });

  if (!personnel) {
    throw new Error("Personnel not found");
  }


  return {
    code: ErrorCodes.OK,
    data: personnel
  };
}