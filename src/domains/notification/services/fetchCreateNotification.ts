export interface CreateNotificationPayload {
  type: NotificationType;
  message: string;
  link: string;
}

export async function fetchCreateNotification(
  payload: CreateNotificationPayload
) {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Could not create notification (${res.status}): ${err.error || res.statusText}`
    );
  }

  return (await res.json()) as {
    id: string;
    type: NotificationType;
    message: string;
    link: string;
    isRead: boolean;
    createdAt: string;
  };
}
