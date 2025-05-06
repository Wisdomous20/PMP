export default async function fetchApproveServiceRequest(
  serviceRequestId: string,
  supervisorId: string,
  note: string
) {
  const endpoint = "/api/service-request/approve";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceRequestId, supervisorId, note }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to approve service request:", error);
    throw error;
  }
}
