export default async function fetchCreateImplementationPlan(
    tasks: { id: string; name: string; deadline: Date; checked: boolean }[],
  ): Promise<ImplementationPlan> { 
    const endpoint = '/api/implementation-plan';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
  
      const responseData = await response.json();
      return responseData; 
    } catch (error) {
      console.error('Failed to create implementation plan:', error);
      throw error; 
    }
  }