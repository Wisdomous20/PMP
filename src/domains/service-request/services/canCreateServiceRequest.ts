import { hasUnratedCompletedRequest } from "./hasUnratedCompletedRequest";
import { hasReachedPendingLimit } from "./hasReachedPendingLimit";

export async function canCreateServiceRequest(
  userId: string,
  pendingLimit?: number
): Promise<boolean> {
  const hasUnrated = await hasUnratedCompletedRequest(userId);
  if (hasUnrated) {
    return false;
  }
  const reachedLimit = await hasReachedPendingLimit(userId, pendingLimit);
  return !reachedLimit;
}