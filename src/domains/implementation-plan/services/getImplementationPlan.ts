export default async function getImplementationPlan(planId: string): Promise<any> { 
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
      console.error('Failed to retrieve implementation plan:', error);
      throw error;
    }
  }