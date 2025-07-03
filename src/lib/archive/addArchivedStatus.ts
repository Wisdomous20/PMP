"use server";

import { $Enums } from "@prisma/client";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface ArchivedStatus extends GenericFailureType {
  data?: {
    status: $Enums.status;
    id: string;
    timestamp: Date;
    serviceRequestId: string;
    note: string | null;
  }
}

export async function addArchivedStatus(serviceRequestId: string): Promise<ArchivedStatus> {
  try {
    const status = await client.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "archived",
        timestamp: new Date(),
      },
    });

    const deleteDate = new Date();
    deleteDate.setFullYear(deleteDate.getFullYear() + 5);

    await client.serviceRequest.update({
      where: { id: serviceRequestId },
      data: {
        deleteAt: deleteDate,
      },
    });
    return {
      code: ErrorCodes.OK,
      data: status
    };
  } catch (error) {
    console.error("Error adding archived status:", error);
    throw error;
  }
}