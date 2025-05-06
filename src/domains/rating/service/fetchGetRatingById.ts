export default async function fetchGetRatingById(
    serviceRequestId: string
    ): Promise<ServiceRequest> {
    const endpoint = `/api/rating/${serviceRequestId}`;
    
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
        console.error("Failed to fetch rating by ID:", error);
        throw error;
    }
    }