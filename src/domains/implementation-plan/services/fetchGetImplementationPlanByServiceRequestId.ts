export default async function fetchImplementationPlanByServiceRequestID(
    serviceRequestId: string
  ): Promise<ImplementationPlan | null> {
    const endpoint = `/api/implementation-plan/${serviceRequestId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(
        `Failed to retrieve implementation plan for serviceRequestId "${serviceRequestId}" from endpoint "${endpoint}":`,
        error
      );
      throw error;
    }
  }