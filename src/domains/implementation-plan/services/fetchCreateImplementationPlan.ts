export default async function fetchCreateImplementationPlan(
  serviceRequestId: string, tasks: Task[]
): Promise<ImplementationPlan> {
  const endpoint = "/api/implementation-plan";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceRequestId, tasks,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to create implementation plan:", error);
    throw error;
  }
}
