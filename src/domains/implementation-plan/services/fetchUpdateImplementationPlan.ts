export default async function fetchUpdateImplementationPlan(
  serviceRequestId: string, 
  tasks: Task[],
  status?: string
) {

  const endpoint = `/api/implementation-plan/${serviceRequestId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks,
        ...(status && { status })
      }),

    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to update implementation plan:", error);
    throw error;
  }
}
