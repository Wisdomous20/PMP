export async function fetchDashboardData(userId: string) {
  const params = new URLSearchParams({ userId });
  
  const response = await fetch(`/api/dashboard/data?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
}