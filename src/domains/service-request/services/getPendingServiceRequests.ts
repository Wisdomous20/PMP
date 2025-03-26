import { prisma } from "@/lib/prisma";

export async function getPendingServiceRequests() {
  const requests = await prisma.serviceRequest.findMany({
    where: {
      status: {
        every: {
          status: "pending",
        },
        none: {
          status: { not: "pending" },
        },
      },
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

  const formattedRequests = requests.map((request) => {
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

  // const sortedRequests = requests.sort((a, b) => {
  //   const aPendingTimestamps = a.status
  //     .filter(s => s.status === "pending")
  //     .map(s => new Date(s.timestamp).getTime());
  //   const bPendingTimestamps = b.status
  //     .filter(s => s.status === "pending")
  //     .map(s => new Date(s.timestamp).getTime());

  //   const aMax = aPendingTimestamps.length > 0 ? Math.max(...aPendingTimestamps) : 0;
  //   const bMax = bPendingTimestamps.length > 0 ? Math.max(...bPendingTimestamps) : 0;

  //   return bMax - aMax;
  // });

  return formattedRequests;
}
