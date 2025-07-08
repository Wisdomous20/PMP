"use server";

import { hasUnratedCompletedRequest } from "@/lib/service-request/request-status-helpers/has-unrated-completed-request";
import { hasReachedPendingLimit } from "@/lib/service-request/request-status-helpers/has-reached-pending-limit";

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