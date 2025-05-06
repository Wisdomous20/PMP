export default async function fetchUpdateImplementationPlanStatus(
  id: string, 
  status: string
): Promise<{ status: string }> {
  try {
    const response = await fetch(`/api/implementation-plan/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || 'Failed to update implementation plan status');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating implementation plan status:', error);
    throw error;
  }
}