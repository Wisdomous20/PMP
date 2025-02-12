export default async function fetchCreateServiceRequestRating(serviceRequestId: string, rating: number, description: string) {
    const endpoint = `/api/service-request-rating`;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                serviceRequestId,
                rating,
                description,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create service request rating:", error);
        throw error;
    }
}