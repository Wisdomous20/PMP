import { prisma } from "@/lib/prisma"

export async function hasUnratedCompletedRequest(userId: string): Promise<boolean> {
  const requests = await prisma.serviceRequest.findMany({
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