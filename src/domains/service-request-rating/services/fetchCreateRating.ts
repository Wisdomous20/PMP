export default async function fetchCreateServiceRequestRating(
  serviceRequestId: string,
  rating: number,
  description: string,
  surveyData: {
    startOnTime: string;
    startReason: string;
    achievedResults: string;
    resultReason: string;
    satisfaction: number | null;
    feedback: string;
  }
) {
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
                surveyData
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
