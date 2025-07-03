"use server";

import { $Enums } from "@prisma/client";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface ApprovedStatusResult extends GenericFailureType {
  data?: {
    id: string;
    serviceRequestId: string;
    timestamp: Date;
    note: string | null;
    status: $Enums.status;
  }
}

export async function addApprovedStatus(serviceRequestId: string, note: string): Promise<ApprovedStatusResult> {
  try {
    const status = await client.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "approved",
        timestamp: new Date(),
        note: note
      },
    });
    return {
      code: ErrorCodes.OK,
      data: status
    };
  } catch (error) {
    console.error("Error adding approved status:", error);
    throw error;
  }
}