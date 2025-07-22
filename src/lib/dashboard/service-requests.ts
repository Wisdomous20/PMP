"use server";

import client from "@/lib/database/client";
import type {Prisma, User} from "@prisma/client";

export async function getPendingServiceRequests(user: User) {
  const whereConditions: Prisma.ServiceRequestWhereInput = {
    status: {
      every: {
        status: "pending",
      },
      none: {
        status: { not: "pending" },
      },
    },
  };

  if (user.user_type === 'SUPERVISOR') {
    whereConditions.user = {
      department: user.department,
    };
  }

  const requests = await client.serviceRequest.findMany({
    where: whereConditions,
    include: {
      user: true,
      status: {
        orderBy: {
          timestamp: "desc",
        },
      },
    },
  });

  return requests.map((request) => {
    const { id, user, concern, details, status } = request;
    const requesterName = `${user.firstName} ${user.lastName}`;
    const createdOn = status.length > 0 ? status[0].timestamp : null;
    return {
      id,
      user,
      requesterName,
      concern,
      details,
      status,
      createdOn,
    };
  });
}
