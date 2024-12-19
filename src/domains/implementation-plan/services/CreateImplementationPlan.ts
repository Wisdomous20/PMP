import { prisma } from "@/lib/prisma";

//Add files in the future and description

export default async function CreateImplementationPlan(serviceRequestId: string, tasks: Task[]) {
  try {
    const implementationPlan = await prisma.implementationPlan.create({
      data: {
        serviceRequestId, // Linking to the ServiceRequest
        description: "", // You can update this to accept a description from the user if needed
        status: "pending",
        tasks: {
          create: tasks.map((task) => ({
            name: task.name,
            deadline: task.deadline,
            checked: task.checked,
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
