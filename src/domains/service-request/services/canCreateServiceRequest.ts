import { hasUnratedCompletedRequest } from "./hasUnratedCompletedRequest";
import { hasReachedPendingLimit } from "./hasReachedPendingLimit";

type CreateSRResult = {
  allowed: boolean;
  hasUnratedCompleted: boolean;
  reachedPendingLimit: boolean;
};

export async function canCreateServiceRequest(
  userId: string,
): Promise<CreateSRResult> {
  const hasUnratedCompleted = await hasUnratedCompletedRequest(userId);
  const reachedPendingLimit = await hasReachedPendingLimit(userId);

  const allowed = !hasUnratedCompleted && !reachedPendingLimit;

  return {
    allowed,
    hasUnratedCompleted,
    reachedPendingLimit,
  };
}