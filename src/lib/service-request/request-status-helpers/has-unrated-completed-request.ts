"use server";

import client from "@/lib/database/client";

export async function hasUnratedCompletedRequest(userId: string): Promise<boolean> {
  const requests = await client.serviceRequest.findMany({
    where: { userId },
    include: {
      status: { orderBy: { timestamp: 'desc' }, take: 1 },
      ServiceRequestRating: true,
    },
  });
  return requests.some(sr => {
    const latestStatus = sr.status[0];
    return latestStatus?.status === 'completed' && sr.ServiceRequestRating === null;
  });
}