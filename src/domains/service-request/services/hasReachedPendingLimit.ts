import { prisma } from "@/lib/prisma"

export async function hasReachedPendingLimit(
  userId: string,
  limit = 5
): Promise<boolean> {
  const requests = await prisma.serviceRequest.findMany({
    where: { userId },
    include: {
      status: { orderBy: { timestamp: 'desc' }, take: 1 },
    },
  });
  const pendingCount = requests.reduce((count, sr) => {
    const latest = sr.status[0];
    return count + (latest?.status === 'pending' ? 1 : 0);
  }, 0);
  return pendingCount >= limit;
}