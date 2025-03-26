export async function fetchNotifications(): Promise<AdminNotification[]> {
  const response = await fetch("/api/notifications", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}