export default async function fetchGetPersonnelAssignments(
  implementationPlanId: string
): Promise<Assignment[]> {
  const endpoint = `/api/personnel-assignment/implementation-plan/${implementationPlanId}`;

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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to retrieve personnel assignments:", error);
    throw error;
  }
}