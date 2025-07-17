"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

interface ArchivedServiceRequestsResult extends GenericFailureType {
  data?: Array<{
    id: string;
    name: string;
    title: string;
    department: string;
    requestDate: Date;
    status: string;
    deleteAt: Date | null;
    details: string;
    ServiceRequestRating?: {
      ratings: number;
      description: string;
    } | null;
  }>
}


export async function getArchivedServiceRequests(): Promise<ArchivedServiceRequestsResult> {
  try {
    const serviceRequests = await client.serviceRequest.findMany({
      where: {
        status: {
          some: {
            status: 'archived'
          }
        }
      },
      select: {
        id: true,
        concern: true,
        details: true,
        deleteAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
          }
        },
        status: {
          orderBy: {
            timestamp: 'asc'
          },
          take: 1,
          select: {
            status: true,
            timestamp: true,
          }
        },


        ServiceRequestRating: {
          select: {
            ratings: true,
            description: true,
            questions: true
          }
        }
      },
    });

    // Map the data to match the expected format in the frontend

    const data = serviceRequests.map(request => ({
      id: request.id,
      name: `${request.user.firstName} ${request.user.lastName}`,
      department: request.user.department,
      title: request.concern,
      requestDate: request.status[0]?.timestamp,
      status: "archived",
      deleteAt: request.deleteAt,
      details: request.details,
      ServiceRequestRating: request.ServiceRequestRating
    }));

    return {
      code: ErrorCodes.OK,
      data
    }
  } catch (error) {
    console.error("Error in getArchivedServiceRequests:", error);
    throw error;
  }
}