import { prisma } from "@/lib/prisma";

interface ImplementationPlanResult {
  id: string;
  description: string;
  status: string | null;
  serviceRequest: {
    id: string;
    requesterName: string;
    concern: string;
    details: string;
    createdOn: Date | null;
    status: Array<{ status: string; timestamp: Date }>;
    user: {
      email: string;
      firstName: string;
      lastName: string;
    };
    supervisor: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  };
  tasks: Array<{
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    checked: boolean;
    personnel: Array<{
      id: string;
      name: string;
      department: string;
      position: string;
    }>;
  }>;
}

export default async function getImplementationPlanByServiceRequestId(
  serviceRequestId: string
): Promise<ImplementationPlanResult | null> {
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
            supervisorAssignment: {
              include: {
                supervisor: true,
              },
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
    supervisor: impl.serviceRequest.supervisorAssignment
      ? {
          id: impl.serviceRequest.supervisorAssignment.supervisor.id,
          firstName: impl.serviceRequest.supervisorAssignment.supervisor.firstName,
          lastName: impl.serviceRequest.supervisorAssignment.supervisor.lastName,
          email: impl.serviceRequest.supervisorAssignment.supervisor.email,
        }
      : null,
  },
  tasks: impl.tasks.map((t) => ({
    id: t.id,
    name: t.name,
    startTime: t.startTime,
    endTime: t.endTime,
    checked: t.checked,
    personnel: t.assignments
      ? t.assignments.map((a) => ({
          id: a.personnel.id,
          name: a.personnel.name,
          department: a.personnel.department,
          position: a.personnel.position,
        }))
      : [],
  })),
};
  } catch (error) {
    console.error("Error fetching implementation plan:", error);
    throw error;
  }
}