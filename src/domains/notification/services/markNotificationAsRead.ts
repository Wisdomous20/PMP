export async function markNotificationAsRead(id: string): Promise<AdminNotification> {
  const response = await fetch(`/api/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRead: true }),
  });
  if (!response.ok) throw new Error("Failed to update notification");
  return response.json();
}