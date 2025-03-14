export default async function fetchSetServiceRequestArchive(serviceRequestId: string) {
    const endpoint = `/api/service-request/${serviceRequestId}`;
    
    try {
        const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
        }
    
        return await response.json();
    } catch (error) {
        console.error("Failed to archive service request:", error);
        return null
    }
    }