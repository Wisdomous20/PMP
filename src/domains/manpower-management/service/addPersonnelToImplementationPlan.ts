import { prisma } from "@/lib/prisma";

export default async function addPersonnelToImplementationPlan(implementationPlanId: string, personnelId: string)
: Promise<
{ id: string; 
    implementationPlanId: string; 
    personnelId: string;
 }> {
  try {
    const implementationPlan = await prisma.implementationPlan.findUnique({
      where: { id: implementationPlanId },
    });

    if (!implementationPlan) {
      throw new Error("Implementation plan not found");
    }

    const personnel = await prisma.personnel.findUnique({
      where: { id: personnelId },
    });

    if (!personnel) {
      throw new Error("Personnel not found");
    }

    const personnelAssignment = await prisma.personnelAssignment.create({
      data: {
        implementationPlanId,
        personnelId,
      },
    });

    return personnelAssignment;
  } catch (error) {
    console.error("Error adding personnel to implementation plan:", error);
    throw new Error("Failed to add personnel to implementation plan");
  }
}