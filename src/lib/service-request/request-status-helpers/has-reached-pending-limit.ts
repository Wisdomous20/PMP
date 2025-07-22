"use server";

import client from "@/lib/database/client";

export async function hasReachedPendingLimit(
  userId: string
): Promise<boolean> {
  const user = await client.user.findUnique({
    where: { id: userId },
    select: { pendingLimit: true }
  });
  const limit = user?.pendingLimit ?? 5;

  const requests = await client.serviceRequest.findMany({
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