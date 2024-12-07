import { prisma } from "@/lib/prisma";

//Add files in the future and description

export default async function CreateImplementationPlan(
  tasks: Task[]
) {
  try {
    const ImplementationPlan = await prisma.implementationPlan.create({
      data: {
        description: "",
        status: "pending",
        tasks: {
          create: tasks.map((task) => ({
            id: task.id,
            name: task.name,
            deadline: task.deadline,
            checked: task.checked,
          })),
        },
      },
    });

    return ImplementationPlan;
  } catch (error) {
    console.error("Error creating Implementation Plan", error);
    throw new Error("Failed to create Implementation Plan");
  }
}
