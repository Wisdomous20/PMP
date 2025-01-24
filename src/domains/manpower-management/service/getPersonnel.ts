import { prisma } from "@/lib/prisma"


export default async function getPersonnel() {
  try {
    const personnel = await prisma.personnel.findMany();
    if (!personnel || personnel.length === 0) {
      throw new Error("No personnel found");
    }

    return personnel;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching personnel:", error.message);
    } else {
      console.error("Unknown error fetching personnel:", error);
    }
    throw new Error("Failed to fetch personnel");
  }
}
