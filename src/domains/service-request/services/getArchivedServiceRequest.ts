import { prisma } from "@/lib/prisma";

export default async function getArchivedServiceRequests(userId: string) {
  try { const serviceRequests = await prisma.serviceRequest.findMany({
    where: {
      status: {
        some: {
          status: 'archived'
        }
      }
    },
    select: {
      id: true,
      concern: true,  
      details: true,  
      deleteAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          department: true,
        }
      },
      status: {
        orderBy: {
          timestamp: 'desc'
        },
        take: 1,
        select: {
          status: true,
          timestamp: true,
        }
      },
      
      
      ServiceRequestRating: {
        select: {
          ratings: true,
          description: true
        }
      }
    },
  });

  // Map the data to match the expected format in the frontend
  return serviceRequests.map(request => ({
    id: request.id,
    name: `${request.user.firstName} ${request.user.lastName}`,
    department: request.user.department,
    title: request.concern,
    requestDate: request.status[0]?.timestamp.toISOString() || null,
    status: "archived",
    deleteAt: request.deleteAt?.toISOString() || null,
    details: request.details,  

    ServiceRequestRating: request.ServiceRequestRating
  }));
} catch (error) {
  console.error("Error in getArchivedServiceRequests:", error);
  throw error;
}
}