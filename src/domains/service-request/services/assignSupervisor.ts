import { PrismaClient } from '@prisma/client';
import { sendSupervisorAssignmentEmail } from '@/domains/notification/services/sendSupervisorAssignmentEmail';

const prisma = new PrismaClient();

export default async function assignSupervisor(
  serviceRequestId: string, 
  supervisorId: string,
) {
  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
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

    const supervisor = await prisma.user.findUnique({
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

    await prisma.supervisorAssignment.create({
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

    return {
      success: true,
      message: `Supervisor ${supervisor.firstName} ${supervisor.lastName} successfully assigned`,
      supervisorAssignment: {
        supervisorId: supervisor.id,
        supervisorName: `${supervisor.firstName} ${supervisor.lastName}`,
        serviceRequestId: serviceRequest.id
      }
    };

  } catch (error) {
    console.error('Failed to assign supervisor:', error);
    throw error; // Re-throw to handle at API level
  }
}