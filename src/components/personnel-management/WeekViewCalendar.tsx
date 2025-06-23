"use client"
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type WeekViewCalendarProps = {
  tasks: CalendarTask[]
}

export default function WeekViewCalendar({ tasks }: WeekViewCalendarProps): JSX.Element {
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sunday = new Date(today)
    sunday.setDate(today.getDate() - today.getDay())
    return sunday
  })

  const goToPreviousWeek = () => {
    setSelectedWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setSelectedWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 7)
      return newDate
    })
  }

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(selectedWeekStart)
    day.setDate(selectedWeekStart.getDate() + i)
    return day
  })

  const weekStart = new Date(selectedWeekStart)
  const weekEnd = new Date(selectedWeekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weekTasks = tasks.filter((task) => {
    const taskStart = new Date(task.start);
    return taskStart >= weekStart && taskStart < weekEnd;
  });

  const hourHeight = 60

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-background border border-border rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-bold text-lg">
            {selectedWeekStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {new Date(
              selectedWeekStart.getFullYear(),
              selectedWeekStart.getMonth(),
              selectedWeekStart.getDate() + 6,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col border border-border rounded-lg overflow-hidden">
          <div className="flex bg-muted">
            <div className="w-16"></div>
            {daysOfWeek.map((day, index) => (
              <div key={index} className="flex-1 border-l border-border text-center font-medium py-2 text-sm">
                {day.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="w-16 bg-muted">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="h-[60px] flex items-start justify-end pr-2 text-xs text-muted-foreground">
                  {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                </div>
              ))}
            </div>

            {daysOfWeek.map((day, dayIndex) => {
              const dayTasks = weekTasks.filter((task) => new Date(task.start).toDateString() === day.toDateString());
              return (
                <div key={dayIndex} className="flex-1 relative border-l border-border">
                  <div className="grid grid-rows-24">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="h-[60px] border-t border-border border-dashed"></div>
                    ))}
                  </div>

                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    {dayTasks.map((task) => {
                      const taskStart = new Date(task.start);
                      const taskEnd = new Date(task.end);
                      const startHour = taskStart.getHours() + taskStart.getMinutes() / 60;
                      const endHour = taskEnd.getHours() + taskEnd.getMinutes() / 60;
                      const top = startHour * hourHeight;
                      const height = (endHour - startHour) * hourHeight;
                      return (
                        <div
                          key={task.id}
                          className="absolute bg-blue-500 text-white text-xs rounded-md p-1 overflow-hidden"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            left: "2px",
                            right: "2px",
                          }}
                        >
                          <div className="font-bold truncate">{task.title}</div>
                          <div className="truncate">
                            {formatTime(taskStart)} - {formatTime(taskEnd)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

