export default async function fetchGetRating(id: string) {
    const endpoint = `/api/service-request-rating/${id}`;

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

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch rating:", error);
        throw error;
    }
}