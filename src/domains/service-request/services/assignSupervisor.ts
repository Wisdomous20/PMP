import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function assignSupervisor(serviceRequestId: string, supervisorId: string) {
  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { supervisorAssignment: true }
    });

    if (!serviceRequest) {
      throw new Error('Service Request not found');
    }

    if (!serviceRequest.supervisorAssignment) {
      throw new Error('Supervisor already assigned to this Service Request');
    }

    const supervisor = await prisma.user.findUnique({
      where: { id: supervisorId }
    });

    if (!supervisor) {
      throw new Error('Supervisor not found');
    }

    await prisma.supervisorAssignment.create({
      data: {
        serviceRequestId: serviceRequest.id,
        supervisorId: supervisor.id
      }
    });

    console.log(`Supervisor ${supervisor.firstName} successfully assigned to the Service Request.`);
  } catch (error) {
    console.error('Failed to assign a supervisor:', error);
  }
}
