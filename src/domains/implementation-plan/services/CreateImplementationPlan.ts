import { prisma } from "@/lib/prisma";

// Define Task Type
type Task = {
  name: string;
  startTime: Date;
  endTime: Date;
  checked: boolean;
};

export default async function CreateImplementationPlan(
  serviceRequestId: string,
  tasks: Task[]
) {
  try {
    const implementationPlan = await prisma.implementationPlan.create({
      data: {
        serviceRequestId, 
        description: "",
        status: "pending",
        tasks: {
          create: tasks.map((task) => ({
            name: task.name,
            startTime: task.startTime,
            endTime: task.endTime,
            checked: task.checked,
          })),
        },
      },
      include: {
        tasks: true,
      },
    });

    return implementationPlan;
  } catch (error) {
    console.error("Error creating Implementation Plan:", error);
    throw new Error("Failed to create Implementation Plan");
  }
}
