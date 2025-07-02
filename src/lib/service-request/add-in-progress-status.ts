"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import { $Enums } from "@prisma/client";

interface InProgressStatus extends GenericFailureType {
  data?: {
    id: string;
    serviceRequestId: string;
    status: $Enums.status;
    timestamp: Date;
    note: string | null;
  }
}

export async function addInProgressStatus(serviceRequestId: string, note: string): Promise<InProgressStatus> {
  try {
    const status = await client.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "in_progress",
        timestamp: new Date(),
        note: note
      },
    });
    return {
      code: ErrorCodes.OK,
      data: status
    };
  } catch (error) {
    console.error("Error adding In Progress status:", error);
    throw error;
  }
}