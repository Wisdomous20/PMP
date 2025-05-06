'use server';

import {prisma} from "@/lib/prisma";

export default async function updatePersonnel(id: string, name: string, department: string, position: string) {
  const updatedPersonnel = await prisma.personnel.update({
    where: {id},
    data: {
      name,
      department,
      position,
    },
  });

  return updatedPersonnel;
}