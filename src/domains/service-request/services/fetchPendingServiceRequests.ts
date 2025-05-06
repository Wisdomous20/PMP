export async function fetchPendingServiceRequests(): Promise<ServiceRequest[]> {
  const response = await fetch("/api/service-request/pending", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pending service requests")
  }

  return response.json()
}
