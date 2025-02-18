"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type DayViewCalendarProps = {
  tasks: CalendarTask[]
}

export default function DayViewCalendar({ tasks }: DayViewCalendarProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const goToPreviousDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const goToNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  const tomorrow = new Date(selectedDate)
  tomorrow.setDate(selectedDate.getDate() + 1)

  const dayTasks = tasks.filter((task) => task.start >= selectedDate && task.start < tomorrow)

  const hourHeight = 4 * 16 // 4 quarters and 16px each

  const dateToDecimalHours = (date: Date): number => date.getHours() + date.getMinutes() / 60

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-bold text-lg">{selectedDate.toDateString()}</div>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex border border-border rounded-lg overflow-hidden">
          <div className="w-16 bg-muted">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="h-16 flex items-start justify-end pr-2 text-xs text-muted-foreground">
                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
              </div>
            ))}
          </div>

          <div className="flex-1 relative">
            <div className="grid grid-rows-[repeat(24,1fr)]">
              {" "}
              {/* Added grid-rows to create 24 equal rows */}
              {Array.from({ length: 24 }, (_, i) => (
                <React.Fragment key={i}>
                  <div className="h-4 border-t-2 border-gray-400"></div>
                  <div className="h-4 border-t border-gray-200"></div>
                  <div className="h-4 border-t border-gray-200"></div>
                  <div className="h-4 border-t border-gray-200"></div>
                </React.Fragment>
              ))}
            </div>

            <div className="absolute top-0 left-0 right-0 bottom-0">
              {dayTasks.map((task) => {
                const taskStart = dateToDecimalHours(task.start)
                const taskEnd = dateToDecimalHours(task.end)
                const top = taskStart * hourHeight
                const height = (taskEnd - taskStart) * hourHeight
                return (
                  <div
                    key={task.id}
                    className="absolute bg-blue-500 text-white text-xs rounded-md p-2 overflow-hidden"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left: "10px",
                      right: "10px",
                    }}
                  >
                    <div className="font-bold">{task.title}</div>
                    <div>
                      {formatTime(task.start)} - {formatTime(task.end)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

