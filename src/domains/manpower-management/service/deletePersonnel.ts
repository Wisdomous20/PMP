import { prisma } from "@/lib/prisma";


export default async function deletePersonnel(personnelId: string) {
  const personnel = await prisma.personnel.delete({
    where: { id: personnelId },
  });
  
  if (!personnel) {
    throw new Error("Personnel not found");
  }


  return personnel;
}