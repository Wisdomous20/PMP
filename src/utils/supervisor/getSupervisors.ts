import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getSupervisors() : Promise<Supervisor[]> {
  try {
    const supervisors = await prisma.user.findMany({
      where: {
        user_type: 'SUPERVISOR',
      },
      select: {
        id: true,
        name: true,
        department: true,
      },
    })

    return supervisors
  } catch (error) {
    console.error('Error fetching supervisors:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export default getSupervisors
