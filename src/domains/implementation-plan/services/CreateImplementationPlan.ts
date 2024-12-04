import { prisma } from "@/lib/prisma";

export default async function CreateImplementationPlan(id: string, description: string, status: string, tasks:Tasks[], files:Files[]){
    try {
        const ImplementationPlan = await prisma.implementationPlan.create({
          data: {
            id,
            description,
            status,
            tasks: {
                create: tasks.map(task => ({
                  id: task.id,
                  name: task.name,
                  deadline: task.deadline,
                  checked: task.checked
                })),
              },
              files: {
                create: files.map(file => ({
                  id: file.id,
                  url: file.url
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