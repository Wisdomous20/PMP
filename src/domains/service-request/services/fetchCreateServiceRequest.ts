export default async function fetchCreateServiceRequest(userId : string, concern : string, details : string) : Promise<{
  id: string;
  userId: string;
  concern: string;
  details: string;
}> {
  const endpoint = "/api/service-request";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, concern, details }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to create service request:", error);
    throw error;
  }
}
