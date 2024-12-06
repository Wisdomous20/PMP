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
        user: {
          select: {
            department:true,
            firstName: true,
            lastName:true
          }
        },
        status: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });
  } else if (user.user_type === "SUPERVISOR" && user.department) {
    serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        user: {
          department: user.department,
        },
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 1,
        },
      },
    });
  } else if (user.user_type === "USER") {
    serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
  } else {
    throw new Error("Invalid user type");
  }

  const formattedRequests = serviceRequests.map((request) => {
    const { id, user, concern, details, status } = request;
    const requesterName = `${user.firstName} ${user.lastName}`;
    const createdOn = status.length > 0 ? status[0].timestamp : null;
    const requestStatus = status.length > 0 ? status[0].status : 'pending';

    return {
      id,
      requesterName,
      concern,
      details,
      createdOn,
      status: requestStatus,
      department: user.department,
      user: {
        department: user.department,
      }
    };
  });

  return formattedRequests;
}