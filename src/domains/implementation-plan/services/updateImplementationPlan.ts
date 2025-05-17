import { prisma } from "@/lib/prisma";

interface Task {
  id: string;
  name: string;
  checked: boolean;
  startTime: string | Date;
  endTime: string | Date;
  assignments: ServerPersonnelAssignment[]; // Include personnel assignments
}

type ServerPersonnelAssignment = {
  id: string;
  personnelId: string;
  taskId: string;
  personnel: ServerPersonnel;
};

type ServerPersonnel = {
  id: string;
  name: string;
};

interface ServerServiceRequest {
  id: string;
  concern: string;
  details: string;
}

interface ServerTaskFromGet {
  id: string;
  name: string;
  checked: boolean;
  startTime: string | Date;
  endTime: string | Date;
  assignments: ServerPersonnelAssignment[];
}

export interface ServerImplementationPlan {
  id: string;
  description: string;
  status: string;
  serviceRequestId: string;
  serviceRequest: ServerServiceRequest;
  tasks: ServerTaskFromGet[];
  createdAt: string | Date;
}

export default async function updateImplementationPlan(
  serviceRequestId: string,
  tasks: Task[]
): Promise<ServerImplementationPlan | null> {
  const existingPlan = await prisma.implementationPlan.findUnique({
    where: { serviceRequestId },
    include: {
      serviceRequest: true,
      tasks: {
        include: {
          assignments: {
            include: {
              personnel: true
            }
          }
        }
      },
    },
  });

  if (existingPlan) {
    await prisma.implementationPlan.update({
      where: { id: existingPlan.id },
      data: {
        tasks: {
          deleteMany: {},
          create: tasks.map((task) => ({
            name: task.name,
            startTime: task.startTime,
            endTime: task.endTime,
            checked: task.checked,
            assignments: {
              create: task.assignments?.map(assignment => ({
                id: assignment.id,
                personnelId: assignment.personnelId,
              })) || []
            },
          })),
        },
      },
    });

    const updatedPlan = await prisma.implementationPlan.findUnique({
      where: { serviceRequestId },
      include: {
        serviceRequest: true,
        tasks: {     
          include: {
            assignments: {
              include: {
                personnel: true
              }
            }
          }
        },
      },
    });

    return updatedPlan;
  }
  return null;
}