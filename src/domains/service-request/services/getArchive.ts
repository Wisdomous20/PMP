import { prisma } from "@/lib/prisma";

export default async function getArchivedServiceRequests(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_type: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let archivedServiceRequests;

  if (user.user_type === "ADMIN") {
    archivedServiceRequests = await prisma.serviceRequest.findMany({
      where: { archived: true },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  } else if (user.user_type === "SUPERVISOR") {
    archivedServiceRequests = await prisma.serviceRequest.findMany({
      where: {
        supervisorAssignment: {
          supervisorId: userId,
        },
        archived: true,
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  } else if (user.user_type === "USER") {
    archivedServiceRequests = await prisma.serviceRequest.findMany({
      where: {
        userId,
        archived: true,
      },
      include: {
        user: true,
        status: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  } else {
    throw new Error("Invalid user type");
  }

  const formattedRequests = archivedServiceRequests.map((request) => {
    const { id, user, concern, details, status } = request;
    const requesterName = `${user.firstName} ${user.lastName}`;
    const createdOn = status.length > 0 ? status[0].timestamp : null;
    return {
      id,
      requesterName,
      concern,
      details,
      status,
      createdOn,
    };
  });

  return formattedRequests;
}