"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { updateNotification } from "@/lib/notification/update-notification"

function getNotificationDateGroup(createdAt: string) {
  const now = new Date()
  const date = new Date(createdAt)

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  if (isToday) return "Today"

  const oneWeekAgo = new Date(now)
  oneWeekAgo.setDate(now.getDate() - 7)
  if (date > oneWeekAgo) return "This Week"

  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)
  if (date > oneMonthAgo) return "This Month"

  return date.toLocaleDateString()
}

interface RecentNotificationsProps {
  notifications: AdminNotification[]
  isLoading: boolean
  error: string | null
}

export default function RecentNotifications({
  notifications,
  isLoading,
  error,
}: RecentNotificationsProps) {
  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null)

  const handleSelectNotification = (notification: AdminNotification) => {
    setSelectedNotification(notification)
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateNotification(id, true)
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const groupedNotifications = isLoading
    ? []
    : notifications.reduce<Record<string, AdminNotification[]>>((acc, notification) => {
        const dateLabel = getNotificationDateGroup(notification.createdAt.toLocaleDateString())
        if (!acc[dateLabel]) {
          acc[dateLabel] = []
        }
        acc[dateLabel].push(notification)
        return acc
      }, {})

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b p-4">
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={groupIndex} className="space-y-3">
                  <Skeleton className="h-4 w-20 mb-1" />
                  {Array.from({ length: 2 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-3 mb-2 rounded-md bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-md">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-5 space-y-2">
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-xs font-medium text-gray-500 mb-1">{date}</h3>
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 mb-2 rounded-md transition-colors cursor-pointer ${
                      notification.isRead ? "bg-white" : "bg-amber-50"
                    }`}
                    onClick={() => handleSelectNotification(notification)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-[10px]"
                      >
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {selectedNotification && (
        <Dialog
          open={!!selectedNotification}
          onOpenChange={() => setSelectedNotification(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification.type.toUpperCase()}</DialogTitle>
              <DialogDescription className="text-sm text-gray-700">
                {selectedNotification.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
