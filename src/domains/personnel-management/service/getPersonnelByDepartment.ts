import { prisma } from "@/lib/prisma";

export default async function getPersonnelByDepartment(department: string) {
  try {
    const personnel = await prisma.personnel.findMany({
      where: {
        department: department,
      },
    });
    if (!personnel || personnel.length === 0) {
      throw new Error("No personnel found");
    }
    return personnel;
  } catch (error) {
    console.error("Error fetching personnel:", error);
    throw new Error("Failed to fetch personnel");
  }
}