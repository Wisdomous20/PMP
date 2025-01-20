import { prisma } from "@/lib/prisma";


export default async function createPersonel(name: string, department: string) : Promise<
{ id: string; 
    name: string; 
    department: string;
 }> {

  try {
    const newEmployee = await prisma.personnel.create({
      data: {
        name,
        department,
      },
    });

    return newEmployee;
  } catch (error) {
    console.error("Error creating personnel:", error);
    throw new Error("Failed to create personnel");
  }
}