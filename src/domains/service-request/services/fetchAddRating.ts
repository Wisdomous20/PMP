interface RatingData {
  startOnTime: string;
  startReason: string | null;
  achievedResults: string;
  resultReason: string | null;
  satisfaction: number;
  feedback: string;
}

export default async function fetchAddRating(
  serviceRequestId: string,
  rating: number,
  description: string,
  ratingData: RatingData
) {
  const endpoint = "/api/service-request/rating";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceRequestId, rating, description, ratingData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Failed to add rating status:", error);
    throw error;
  }
}