export default async function fetchGetImplementationPlanById(planId: string): Promise<ImplementationPlan> {
    const endpoint = `/api/implementation-plan/${planId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error}`);
        }

        const responseData = await response.json();
        return responseData; 
    } catch (error) {
        console.error('Failed to retrieve implementation plan by ID:', error);
        throw error;
    }
}