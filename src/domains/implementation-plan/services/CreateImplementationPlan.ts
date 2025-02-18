import { prisma } from "@/lib/prisma";



export default async function CreateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  try {
    const implementationPlan = await prisma.implementationPlan.create({
      data: {
        serviceRequestId,
        description: "", 
        status: "pending",
        tasks: {
          create: tasks.map((task) => ({
            name: task.name,
            deadline: task.deadline,
            checked: task.checked,
            endTime: task.endTime,
            startTime: task.startTime,
          })),

        },
      },
    });

    return implementationPlan;
  } catch (error) {
    console.error("Error creating Implementation Plan", error);
    throw new Error("Failed to create Implementation Plan");
  }
}
