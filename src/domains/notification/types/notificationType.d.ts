type NotificationType =
  | "inventory"
  | "service_request"
  | "implementation_plan"
  | "personnel"

type AdminNotification = {
  id: string;
  type: NotificationType;
  message: string;
  link: string;
  department?: string;
  supervisorId?: string;
  isRead: boolean;
  createdAt: string;
}