"use server";

import client from "@/lib/database/client";

export async function getSupervisors() : Promise<Supervisor[]> {
  try {
    const supervisors = await client.user.findMany({
      where: {
        user_type: 'SUPERVISOR',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        department: true,
      },
    })

    return supervisors
  } catch (error) {
    console.error('Error fetching supervisors:', error)
    throw error
  }
}

