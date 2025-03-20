import { prisma } from "@/lib/prisma";

export default async function getPersonnel() {
  try {
    const personnel = await prisma.personnel.findMany({
      include: {
        assignments: {
          include: {
            Task: true,
          },
        },
      },
    });

    if (!personnel || personnel.length === 0) {
      throw new Error("No personnel found");
    }

    const formattedPersonnel = personnel.map((person) => {
      const tasks = person.assignments.map((assignment) => ({
        id: assignment.Task.id,
        title: assignment.Task.name,
        start: assignment.Task.startTime,
        end: assignment.Task.endTime,
      }));
      return {
        ...person,
        tasks,
      };
    });

    return formattedPersonnel;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching personnel:", error.message);
    } else {
      console.error("Unknown error fetching personnel:", error);
    }
    throw new Error("Failed to fetch personnel");
  }
}
