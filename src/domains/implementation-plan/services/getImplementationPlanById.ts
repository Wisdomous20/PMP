import { prisma } from "@/lib/prisma";

export default async function getImplementationPlanById(
  implementationPlanId: string
): Promise<ImplementationPlan> {
  const implementationPlan = await prisma.implementationPlan.findUnique({
    where: { id: implementationPlanId },
    include: {
      tasks: true,
      files: true,
      serviceRequest: true,
    },
  });

  if (!implementationPlan) {
    throw new Error("Implementation plan not found");
  }

  const { id, description, status, tasks, files, serviceRequest } =
    implementationPlan;
  const serviceRequests: ServiceRequest[] = Array.isArray(serviceRequest)
    ? serviceRequest
    : [];
  return {
    id,
    description,
    status,
    tasks,
    files,
    serviceRequest: serviceRequests,
  };
}
