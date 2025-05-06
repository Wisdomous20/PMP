import { prisma } from "@/lib/prisma";

export default async function getPersonnelById(personnelId: string) {
  const personnel = await prisma.personnel.findUnique({
    where: { id: personnelId },
  });

  if (!personnel) {
    throw new Error("Personnel not found");
  }
  

  return personnel;
}
