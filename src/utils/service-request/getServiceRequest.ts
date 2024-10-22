import { prisma } from "@/lib/prisma";

export default async function getServiceRequests(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
      department: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let serviceRequests;

  if (user.user_type === "ADMIN") {
    serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        user: true,
        status: true,
        implementationPlan: true,
        ServiceRequestRating: true,
      },
    });
  } else if (user.user_type === "SUPERVISOR" && user.department) {
    if (user.department) {
      serviceRequests = await prisma.serviceRequest.findMany({
        where: {
          user: {
            department: user.department, // Check department if needed
          },
        },
        include: {
          user: true,
          status: true,
          implementationPlan: true,
          ServiceRequestRating: true,
        },
      });
    } else {
      throw new Error("Supervisor does not have a department assigned");
    }
  } else if (user.user_type === "USER") {
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
    throw new Error("Invalid user type");
  }

  return serviceRequests;
}
