export default async function fetchRejectServiceRequest(
  serviceRequestId: string,
  note: string
) {
  const endpoint = "/api/service-request/reject";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceRequestId, note }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to reject service request:", error);
    throw error;
  }
}