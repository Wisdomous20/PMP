export default async function fetchGetServiceRequestDetails(serviceRequestId: string) : Promise<ServiceRequest | null> {
  const endpoint = `/api/service-request/${serviceRequestId}`;

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

    return await response.json() as ServiceRequest;
  } catch (error) {
    console.error("Failed to fetch service request details:", error);
    return null
  }
}
