import { hasUnratedCompletedRequest } from "./hasUnratedCompletedRequest";
import { hasReachedPendingLimit } from "./hasReachedPendingLimit";

type CreateSRResult = {
  allowed: boolean;
  hasUnratedCompleted: boolean;
  reachedPendingLimit: boolean;
};

export async function canCreateServiceRequest(
  userId: string,
  pendingLimit: number = 5
): Promise<CreateSRResult> {
  const hasUnratedCompleted = await hasUnratedCompletedRequest(userId);
  const reachedPendingLimit = await hasReachedPendingLimit(userId, pendingLimit);

  const allowed = !hasUnratedCompleted && !reachedPendingLimit;

  return {
    allowed,
    hasUnratedCompleted,
    reachedPendingLimit,
  };
}