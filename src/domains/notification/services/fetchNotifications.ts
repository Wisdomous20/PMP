// export async function fetchNotifications(): Promise<AdminNotification[]> {
//   const response = await fetch("/api/notifications", {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });
//   if (!response.ok) throw new Error("Failed to fetch notifications");
//   return response.json();
// }

// import generateSampleNotifications from "@/utils/generateSampleNotifications";

export async function fetchNotifications(userId: string): Promise<AdminNotification[]> {
  const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Could not fetch notifications (${res.status}): ${err.error || res.statusText}`
    );
  }

  return (await res.json()) as AdminNotification[];
}