type NotificationType =
  | "inventory"
  | "service_request"
  | "implementation_plan"
  | "personnel"

type AdminNotification = {
  id: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: string
}