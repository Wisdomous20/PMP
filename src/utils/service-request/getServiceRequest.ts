import { prisma } from "@/lib/prisma";

export default async function getServiceRequests(userType: string, userId?: string, department?: string) {
  let serviceRequests;

  if (userType === "ADMIN") {
    serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        user: true,
        status: true,
        implementationPlan: true,
        ServiceRequestRating: true,
      },
    });
  } else if (userType === "SUPERVISOR" && department) {
    serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        user: {
          supervisor: {
            department,
          },
        },
      },
      include: {
        user: true,
        status: true,
        implementationPlan: true,
        ServiceRequestRating: true,
      },
    });
  } else if (userType === "USER" && userId) {
    serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        status: true,
        implementationPlan: true,
        ServiceRequestRating: true,
      },
    });
  } else {
    throw new Error("Invalid user type or missing parameters");
  }

  return serviceRequests;
}