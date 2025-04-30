import {prisma} from "@/lib/prisma";

export default async function getImplementationPlanByServiceRequestId(
  serviceRequestId: string
): Promise<ImplementationPlan | null> {
  try {
    const implementation = await prisma.implementationPlan.findFirst({
      where: {
        serviceRequestId: serviceRequestId,
      },
      include: {
        tasks: true,
        serviceRequest: true,
      },
    });

    if (!implementation) {
      return null;
    }

    return implementation;
  } catch (error) {
    console.error("Error fetching implementation plan by service request ID:", error);
    throw error;
  }
}