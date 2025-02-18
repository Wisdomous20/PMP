
export async function fetchResolvedStatus(serviceRequestId: string): Promise<ServiceRequest> {
  try {
    const response = await fetch(`/api/service-request/${serviceRequestId}/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch resolved status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching resolved status:', error);
    throw error;
  }
}

export async function updateResolvedStatus(
  serviceRequestId: string,
  status: 'resolved' | 'review_requested'
): Promise<ServiceRequest> {
  try {
    const response = await fetch(`/api/service-request/${serviceRequestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update resolved status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating resolved status:', error);
    throw error;
  }
}
