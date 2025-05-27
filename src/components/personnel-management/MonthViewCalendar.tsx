"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type MonthViewCalendarProps = {
  tasks: CalendarTask[]
}

export default function MonthViewCalendar({ tasks }: MonthViewCalendarProps): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()))

  const dates: Date[] = []
  const iterDate = new Date(startDate)
  while (iterDate <= endDate) {
    dates.push(new Date(iterDate))
    iterDate.setDate(iterDate.getDate() + 1)
  }

  const isTaskOnDate = (task: CalendarTask, date: Date): boolean => {
    const taskStartDate = new Date(task.start)
    const taskEndDate = new Date(task.end)
    
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const normalizedStartDate = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate())
    const normalizedEndDate = new Date(taskEndDate.getFullYear(), taskEndDate.getMonth(), taskEndDate.getDate())
    
    return normalizedDate >= normalizedStartDate && normalizedDate <= normalizedEndDate
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-bold text-lg">
            {new Date(year, month).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center font-medium text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const dayTasks = tasks.filter((task) => isTaskOnDate(task, date))
            const isCurrentMonth = date.getMonth() === month

            return (
              <div
                key={index}
                className={`border rounded-md p-2 min-h-[100px] ${
                  isCurrentMonth ? "bg-background" : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const taskStartDate = new Date(task.start)
                    const taskEndDate = new Date(task.end)
                    const isStartDate = taskStartDate.toDateString() === date.toDateString()
                    const isEndDate = taskEndDate.toDateString() === date.toDateString()
                    const isMultiDay = taskStartDate.toDateString() !== taskEndDate.toDateString()
                    
                    let taskClass = "bg-blue-500 text-white text-xs rounded px-1 py-0.5 truncate"
                    let taskTitle = task.title
                    
                    if (isMultiDay) {
                      if (isStartDate) {
                        taskClass += " rounded-r-none"
                        taskTitle = `${task.title} (start)`
                      } else if (isEndDate) {
                        taskClass += " rounded-l-none"
                        taskTitle = `${task.title} (end)`
                      } else {
                        taskClass += " rounded-none"
                        taskTitle = `${task.title} (cont.)`
                      }
                    }
                    
                    return (
                      <div
                        key={`${task.id}-${date.toDateString()}`}
                        className={taskClass}
                        title={`${task.title} (${taskStartDate.toLocaleDateString()} - ${taskEndDate.toLocaleDateString()})`}
                      >
                        {taskTitle}
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}