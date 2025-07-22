"use server";

import client from "@/lib/database/client";
import { ErrorCodes } from "@/lib/ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import { sendSupervisorAssignmentEmail } from '@/lib/mailer/sendSupervisorAssignmentEmail';

interface SupervisorResult extends GenericFailureType {
  data?: {
    success: boolean;
    message: string;
    supervisorAssignment: {
      supervisorId: string;
      supervisorName: string;
      serviceRequestId: string;
    };
  }
}

export async function assignSupervisor(
  serviceRequestId: string,
  supervisorId: string,
): Promise<SupervisorResult> {
  try {
    const serviceRequest = await client.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: {
        supervisorAssignment: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!serviceRequest) {
      throw new Error('Service Request not found');
    }

    if (serviceRequest.supervisorAssignment) {
      throw new Error('Supervisor already assigned to this Service Request');
    }

    const supervisor = await client.user.findUnique({
      where: { id: supervisorId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        user_type: true
      }
    });

    if (!supervisor) {
      throw new Error('Supervisor not found');
    }

    if (supervisor.user_type !== 'SUPERVISOR') {
      throw new Error('Selected user is not a supervisor');
    }

    await client.supervisorAssignment.create({
      data: {
        serviceRequestId: serviceRequest.id,
        supervisorId: supervisor.id
      }
    });

    try {
      await sendSupervisorAssignmentEmail({
        to: supervisor.email,
        supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
        serviceRequestId: serviceRequest.id,
        concern: serviceRequest.concern,
        details: serviceRequest.details,
        color: "#2c3e50"
      });
    } catch (emailError) {
      console.error('Failed to send assignment email:', emailError);
    }

    const data = {
      success: true,
      message: `Supervisor ${supervisor.firstName} ${supervisor.lastName} successfully assigned`,
      supervisorAssignment: {
        supervisorId: supervisor.id,
        supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
        serviceRequestId: serviceRequest.id
      }
    }

    return {
      code: ErrorCodes.OK,
      data
    };

  } catch (error) {
    console.error('Failed to assign supervisor:', error);
    throw error; // Re-throw to handle at API level
  }
}