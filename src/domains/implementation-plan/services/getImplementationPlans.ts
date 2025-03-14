import { prisma } from "@/lib/prisma";

export default async function getImplementationPlans(userId: string): Promise<ImplementationPlan[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let implementationPlans;

  if (user.user_type === "ADMIN") {
    implementationPlans = await prisma.implementationPlan.findMany({
      include: {
        tasks: true,
        files: true,
        serviceRequest: {
          include: {
            user: true,
            status: true,
          },
        },
      },
    });
  } else if (user.user_type === "SUPERVISOR") {
    implementationPlans = await prisma.implementationPlan.findMany({
      where: {
        serviceRequest: {
          supervisorAssignment: {
            supervisorId: userId,
          },
        },
      },
      include: {
        tasks: true,
        files: true,
        serviceRequest: {
          include: {
            user: true,
            status: true,
          },
        },
      },
    });
  } else {
    throw new Error("Invalid user type");
  }

  // Format the response
  const formattedPlans: ImplementationPlan[] = implementationPlans.map((plan) => {
    const { id, description, status, tasks, files, serviceRequest } = plan;
    const requesterName = `${serviceRequest.user.firstName} ${serviceRequest.user.lastName}`;
    
    // Get earliest status timestamp as createdOn
    const createdOn =
      serviceRequest.status.length > 0
        ? serviceRequest.status.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0].timestamp
        : null;

    return {
      id,
      description,
      status,
      files: files.map((file) => ({
        id: file.id,
        implementationPlanId: file.implementationPlanId,
        url: file.url,
      })),
      tasks: tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime, // Updated field name
        endTime: task.endTime, // Updated field name
        checked: task.checked,
      })),
      serviceRequest: [{
        id: serviceRequest.id,
        requesterName,
        concern: serviceRequest.concern,
        details: serviceRequest.details,
        createdOn,
        status: serviceRequest.status.map((s) => ({
          id: s.id,
          status: s.status,
          timestamp: s.timestamp,
          note: s.note,
        })),
      }],
    };
  });

  return formattedPlans;
}
