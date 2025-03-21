export default async function fetchAssignSupervisor(serviceRequestId: string, supervisorId: string) {
  const endpoint = "/api/service-request/assign-supervisor";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceRequestId, supervisorId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to assign supervisor to service request:", error);
    throw error;
  }
}