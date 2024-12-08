export async function fetchAddApprovedStatus(serviceRequestId: string, note: string) {
  const endpoint = "/api/service-request/approve";

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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to approve service request:", error);
    throw error;
  }
}

export async function fetchAddRejectedStatus(serviceRequestId: string, note: string) {
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

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to reject service request:", error);
    throw error;
  }
}
