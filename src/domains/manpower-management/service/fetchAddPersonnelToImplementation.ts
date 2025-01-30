export default async function fetchAddPersonnelToImplementation(implementationPlanId: string, personnelId: string) {
    const endpoint = `/api/manpower-management`
    try {
        const response = await fetch(endpoint, {
            method: "POST",
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
        console.error("Failed to add personnel to implementation plan:", error);
        throw error;
    }
}