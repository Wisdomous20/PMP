import { prisma } from "@/lib/prisma";

export default async function updateImplementationPlanStatus(
  id: string,
  status: string
) {
  try {
    const existingPlan = await prisma.implementationPlan.findUnique({
      where: { id },
      select: { id: true, status: true }
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
    
    return updatedPlan;
    
  } catch (error) {
    console.error('DB Service: Update failed:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}