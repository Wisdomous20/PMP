"use server";

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import validator from "@/lib/validators";

interface GetServiceRequestByIdResult extends GenericFailureType {
  data?: {
    id: string;
    requesterName: string;
    concern: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    }
    details: string;
    createdOn: Date | null,
    status: Array<{
      id: string
      status: "pending" | "approved" | "rejected" | "in_progress" | "archived" | "completed" ;
      timestamp: Date;
      note: string | null
    }>
  }
}

export async function getServiceRequestById(id: string): Promise<GetServiceRequestByIdResult> {
  const validation = await validator.validate({ id }, {
    properties: {
      id: {type: "string", formatter: "non-empty-string"},
    },
    requiredProperties: ["id"],
  });

  if (!validation.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validation.errors),
    }
  }

  // Find the service request by id
  const serviceRequest = await client.serviceRequest.findUnique({
    where: { id },
    include: {
      user: true,
      status: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
  if (!serviceRequest) {
    return {
      code: ErrorCodes.SERVICE_REQUEST_NOT_FOUND,
      message: "Service request not found.",
    }
  }

  const { user, status } = serviceRequest;
  const requesterName = `${user.firstName} ${user.lastName}`;
  const createdOn = status.length > 0 ? status[0].timestamp : null;

  const serviceRequestStatus = status.map(x => ({
    id: x.id,
    status: x.status,
    timestamp: x.timestamp,
    note: x.note,
  }));

  return {
    code: ErrorCodes.OK,
    data: {
      id,
      requesterName,
      concern: serviceRequest.concern,
      user,
      details: serviceRequest.details,
      createdOn,
      status: serviceRequestStatus,
    }
  }
}
