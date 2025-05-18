export interface CreateSRResult {
  allowed: boolean;
  hasUnratedCompleted: boolean;
  reachedPendingLimit: boolean;
}

export default async function fetchCanCreateServiceRequest(
  userId: string
): Promise<CreateSRResult | null> {
  const endpoint = `/api/service-request/can-create?userId=${encodeURIComponent(
    userId
  )}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return (await response.json()) as CreateSRResult;
  } catch (error) {
    console.error(
      "Failed to check service request creation eligibility:",
      error
    );
    return null;
  }
}
