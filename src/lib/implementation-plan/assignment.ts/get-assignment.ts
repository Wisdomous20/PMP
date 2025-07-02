"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";

// interface AssignmentResult extends GenericFailureType {
//   data?: {
//     id: string;
//     name: string;
//     startTime: Date;
//     endTime: Date;
//     checked: boolean;
//     personnel: Array<{
//       id: string;
//       name: string;
//       department: string;
//       position: string;
//     }>;
//   }
// }

export async function getAssignments(id: string, assignments: string[]) {

  try {
    const implementationPlan = await client.implementationPlan.findUnique({
      where: { serviceRequestId: id },
      include: {
        tasks: {
          include: {
            assignments: assignments ? {
              include: { personnel: true }
            } : false
          }
        }
      }
    });

    if (!implementationPlan) {
      return {
        code: ErrorCodes.IMPLEMENTATION_PLAN_NOT_FOUND,
        message: "Implementation plan not found",
      }
    }

    return {
      code: ErrorCodes.OK,
      data: implementationPlan
    }
  } catch (error) {
    console.error("Error fetching implementation plan:", error);
    return {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch implementation plan",
    }
  }
}