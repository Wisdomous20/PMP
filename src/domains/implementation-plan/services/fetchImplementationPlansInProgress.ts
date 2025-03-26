export default async function fetchImplementationPlansInProgress(): Promise<
  Array<{
    id: string;
    concern: string;
    details: string;
    tasks: number;
    progress: number;
  }>
> {
  try {
    const response = await fetch(`/api/implementation-plan/in-progress`, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || 'Failed to fetch implementation plans');
    }

    return data;
  } catch (error) {
    console.error('Error fetching implementation plans:', error);
    throw error;
  }
}
