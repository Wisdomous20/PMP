export default async function fetchUpdateRating(id: string, rating: number, description: string) {
    const endpoint = `/api/service-request-rating/${id}`;

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
        console.error("Failed to update rating:", error);
        throw error;
    }
}