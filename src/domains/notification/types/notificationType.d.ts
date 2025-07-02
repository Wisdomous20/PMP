type NotificationType =
  | "inventory"
  | "service_request"
  | "implementation_plan"
  | "personnel"

type AdminNotification = {
  id: string;
  type: NotificationType;
  typePretty: string;
  message: string;
  link: string;
  department?: string | null;
  supervisorId?: string | null;
  isRead: boolean;
  createdAt: Date;
}