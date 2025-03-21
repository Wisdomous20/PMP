import { prisma } from "@/lib/prisma";
import addCompletedStatus from "@/domains/service-request/services/status/addCompletedStatus";

export default async function updateImplementationPlanStatus(
  id: string,
  status: string
) {
  try {
    const existingPlan = await prisma.implementationPlan.findUnique({
      where: { id },
      select: { id: true, status: true, serviceRequestId: true }
    });

    if (!existingPlan) {
      console.error('DB Service: Plan not found:', id);
      throw new Error('Implementation plan not found');
    }

    const updatedPlan = await prisma.implementationPlan.update({
      where: {
        id: id
      },
      data: {
        status: status
      },
      include: {
        serviceRequest: true,
        tasks: true
      }
    });

    if (status === "completed") {
      await addCompletedStatus(existingPlan.serviceRequestId);
    }    
    return updatedPlan;
  
  } catch (error) {
    console.error('DB Service: Update failed:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}