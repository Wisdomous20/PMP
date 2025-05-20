import { prisma } from "@/lib/prisma";

export default async function getImplementationPlanByServiceRequestId(
  serviceRequestId: string
): Promise<ImplementationPlan | null> {
  try {
    const impl = await prisma.implementationPlan.findFirst({
      where: { serviceRequestId },
      include: {
        tasks: {
          include: {
            assignments: {
              include: {
                personnel: true,
              },
            },
          },
        },
        serviceRequest: {
          include: {
            user: true,
            status: {
              orderBy: { timestamp: "asc" },
            },
          },
        },
      },
    });

    if (!impl) return null;

    const statuses = impl.serviceRequest.status;
    const createdOn = statuses.length > 0 ? statuses[0].timestamp : null;
    const latestStatus = statuses.length > 0 ? statuses[statuses.length - 1].status : null;

    return {
      id: impl.id,
      description: impl.description,
      status: latestStatus!,
      serviceRequest: {
        id: impl.serviceRequest.id,
        requesterName: `${impl.serviceRequest.user.firstName} ${impl.serviceRequest.user.lastName}`,
        concern: impl.serviceRequest.concern,
        details: impl.serviceRequest.details,
        createdOn,
        status: statuses,
        user: {
          email: impl.serviceRequest.user.email,
          firstName: impl.serviceRequest.user.firstName,
          lastName: impl.serviceRequest.user.lastName,
        },
      },
      tasks: impl.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        startTime: t.startTime,
        endTime: t.endTime,
        checked: t.checked,
        personnel: t.assignments
          ? t.assignments.map((a) => a.personnel)
          : [],
      })),
    };
  } catch (error) {
    console.error("Error fetching implementation plan:", error);
    throw error;
  }
}