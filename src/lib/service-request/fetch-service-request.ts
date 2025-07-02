"use server";

import { $Enums } from "@prisma/client";
import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import type { GenericFailureType } from "@/lib/types/GenericFailureType";

interface ServiceRequest {
  id: string;
  requesterName: string;
  concern: string;
  details: string;
  status: Array<{
    id: string;
    serviceRequestId: string;
    status: $Enums.status;
    timestamp: Date;
    note: string | null;
  }>;
  createdOn: Date | null;
}

interface ServiceRequestResult extends GenericFailureType {
  data?: ServiceRequest[]
}

export async function getServiceRequests(userId: string): Promise<ServiceRequestResult> {
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let serviceRequests: ServiceRequest[];

  if (user.user_type === "ADMIN" || user.user_type === "SECRETARY") {
    const result = await client.serviceRequest.findMany({
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    serviceRequests = result.map((request) => ({
      id: request.id,
      requesterName: `${request.user.firstName} ${request.user.lastName}`,
      concern: request.concern,
      details: request.details,
      status: request.status,
      createdOn: request.status.length > 0 ? request.status[0].timestamp : null,
    }));
  } else if (user.user_type === "SUPERVISOR") {
    const result = await client.serviceRequest.findMany({
      where: {
        supervisorAssignment: {
          supervisorId: userId
        },
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    serviceRequests = result.map((request) => ({
      id: request.id,
      requesterName: `${request.user.firstName} ${request.user.lastName}`,
      concern: request.concern,
      details: request.details,
      status: request.status,
      createdOn: request.status.length > 0 ? request.status[0].timestamp : null,
    }));
  } else if (user.user_type === "USER") {
    const result = await client.serviceRequest.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    serviceRequests = result.map((request) => ({
      id: request.id,
      requesterName: `${request.user.firstName} ${request.user.lastName}`,
      concern: request.concern,
      details: request.details,
      status: request.status,
      createdOn: request.status.length > 0 ? request.status[0].timestamp : null,
    }));
  } else {
    throw new Error("Invalid user type");
  }

  const formattedRequests = serviceRequests.map((request) => {
    const { id, concern, details, status } = request;
    const requesterName = request.requesterName;
    const createdOn = status.length > 0 ? status[0].timestamp : null;
    return {
      id,
      requesterName,
      concern,
      details,
      status,
      createdOn,
    };
  });

  return {
    code: ErrorCodes.OK,
    data: formattedRequests
  };
}