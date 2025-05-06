// lib/fetchDashboardStats.ts
export async function fetchDashboardStats() {
  const response = await fetch("/api/dashboard/stats", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
}
