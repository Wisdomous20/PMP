"use server";

import { $Enums } from "@prisma/client";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface RejectedStatusResult extends GenericFailureType {
  data?: {
    id: string;
    serviceRequestId: string;
    timestamp: Date;
    note: string | null;
    status: $Enums.status;
  }
}

export async function addRejectedStatus(serviceRequestId: string, note: string): Promise<RejectedStatusResult> {
  try {
    const status = await client.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "rejected",
        timestamp: new Date(),
        note: note
      },
    });
    return {
      code: ErrorCodes.OK,
      data: status
    };
  } catch (error) {
    console.error("Error adding rejected status:", error);
    throw error;
  }
}