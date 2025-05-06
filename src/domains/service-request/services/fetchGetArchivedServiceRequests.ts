export default async function fetchGetArchivedServiceRequests(userId: string) {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);
    const endpoint = `/api/service-request/archive?${queryParams.toString()}`;
    
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch archived service requests:", error);
      throw error;
    }
  }