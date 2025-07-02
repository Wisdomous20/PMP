"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import type { GenericFailureType } from "@/lib/types/GenericFailureType";

interface ServiceRequestParams {
  id: string;
  userId: string;
  concern: string;
  details: string;
}

interface CreateServiceRequestResult extends GenericFailureType {
  data?: ServiceRequestParams;
}

export async function createServiceRequest(userId: string, concern: string, details: string): Promise<CreateServiceRequestResult> {
  try {
    const serviceRequest = await client.serviceRequest.create({
      data: {
        userId,
        concern,
        details,
        status: {
          create: {
            status: "pending",
            timestamp: new Date(),
          },
        },
      },
    });

    return {
      code: ErrorCodes.OK,
      data: serviceRequest
    };
  } catch (error) {
    console.error("Error creating service request:", error);
    throw new Error("Failed to create service request");
  }
}
