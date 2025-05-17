"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { ImplementationPlanCard } from "./ImplementationPlansBoardNew"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TaskCardProps {
  card: ImplementationPlanCard
  onClick: () => void
}

export default function ImplementationPlanCard({ card, onClick }: TaskCardProps) {
  const completedTasks = card.tasks.filter((task) => task.completed).length
  const totalTasks = card.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const startDates = card.tasks.map((task) => new Date(task.startTime).getTime())
  const endDates = card.tasks.map((task) => new Date(task.endTime).getTime())

  const earliestStart = startDates.length > 0 ? new Date(Math.min(...startDates)) : null
  const latestEnd = endDates.length > 0 ? new Date(Math.max(...endDates)) : null

  const assignees = Array.from(new Set(card.tasks.map((task) => task.assignee)))

  const now = new Date().getTime()
  const hasSoonDueTask = card.tasks.some((task) => {
    if (task.completed) return false
    const endTime = new Date(task.endTime).getTime()
    return endTime > now && endTime - now < 24 * 60 * 60 * 1000
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card
      className={`mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200 relative ${
        hasSoonDueTask ? "border-l-4 border-l-amber-500" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">{card.concern}</h3>

        {card.tasks.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                {completedTasks} of {totalTasks} tasks
              </span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full ${
                  progress === 100
                    ? "bg-green-500"
                    : progress > 50
                      ? "bg-blue-500"
                      : progress > 0
                        ? "bg-amber-500"
                        : "bg-gray-400"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {earliestStart && latestEnd && (
              <div className="flex items-center text-xs text-gray-500 mt-3">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(earliestStart)} - {formatDate(latestEnd)}
              </div>
            )}

            {assignees.length > 0 && (
              <div className="flex -space-x-2 mt-3">
                {assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                    <AvatarFallback className="text-[10px] bg-gray-200">{getInitials(assignee)}</AvatarFallback>
                  </Avatar>
                ))}
                {assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]">
                    +{assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">No tasks added yet</p>
        )}
      </CardContent>
    </Card>
  )
}
