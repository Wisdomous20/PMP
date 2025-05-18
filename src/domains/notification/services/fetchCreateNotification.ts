export interface CreateNotificationPayload {
  type: NotificationType;
  message: string;
  link: string;
  department?: string;
  supervisorId?: string;
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

  return (await res.json()) as AdminNotification;
}