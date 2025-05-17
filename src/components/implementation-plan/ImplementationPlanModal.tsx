"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash, Plus, X, User, Clock, CheckCircle2, Circle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { ImplementationPlanCard, FrontendTask as Task } from "./ImplementationPlansBoardNew"

interface CardModalProps {
  card: ImplementationPlanCard
  isOpen: boolean
  onClose: () => void
  onSave: (card: ImplementationPlanCard) => void
  teamMembers: string[]
}

export default function ImplementationPlanModal({
  card,
  isOpen,
  onClose,
  onSave,
  teamMembers = ["Alex Chen", "Sarah Johnson", "Michael Wong", "Emily Davis", "Jordan Smith", "Taylor Brown"],
}: CardModalProps) {
  const [editedCard, setEditedCard] = useState<ImplementationPlanCard>({ ...card })
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleTaskCompletionChange = (taskId: string, completed: boolean) => {
    setEditedCard({
      ...editedCard,
      tasks: editedCard.tasks.map((task) => (task.id === taskId ? { ...task, completed } : task)),
    })
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      startTime: now.toISOString().slice(0, 16),
      endTime: tomorrow.toISOString().slice(0, 16),
      assignee: "Unassigned",
    }

    setEditedCard({
      ...editedCard,
      tasks: [...editedCard.tasks, newTask],
    })

    setNewTaskTitle("")
    setShowNewTaskForm(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setEditedCard({
      ...editedCard,
      tasks: editedCard.tasks.filter((task) => task.id !== taskId),
    })
  }

  const handleUpdateTask = (taskId: string, field: keyof Task, value: string | boolean) => {
    setEditedCard({
      ...editedCard,
      tasks: editedCard.tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    })
  }

  const handleSave = () => {
    if (editedCard.concern.trim() === "") {
      alert("Card title cannot be empty")
      return
    }
    onSave(editedCard)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSave()
    }
    // Close on Escape
    if (e.key === "Escape") {
      onClose()
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM d, yyyy h:mm a")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return dateString
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Edit Implementation Plan</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Plan Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({editedCard.tasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <div className="p-2 border rounded-md bg-gray-50">{editedCard.concern}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <div className="p-2 border rounded-md bg-gray-50 min-h-[5rem] whitespace-pre-wrap">
                {editedCard.description || "No description provided."}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Tasks</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewTaskForm(true)
                    setActiveTab("tasks")
                  }}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>

              {editedCard.tasks.length > 0 ? (
                <div className="space-y-2 border rounded-md p-3">
                  {editedCard.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 group">
                      <Checkbox
                        id={`details-task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => handleTaskCompletionChange(task.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`details-task-${task.id}`}
                          className={`text-sm ${task.completed ? "line-through text-gray-500" : ""} cursor-pointer`}
                        >
                          {task.title}
                        </label>

                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateForDisplay(task.startTime).split(",")[0]}
                          </div>

                          {task.assignee && (
                            <div className="flex items-center">
                              <Avatar className="h-4 w-4 mr-1">
                                <AvatarFallback className="text-[8px]">{getInitials(task.assignee)}</AvatarFallback>
                              </Avatar>
                              {task.assignee}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedTaskId(task.id)
                          setActiveTab("tasks")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-pencil"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">No tasks added yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewTaskForm(true)
                      setActiveTab("tasks")
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add your first task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Tasks</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTaskForm(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Task
              </Button>
            </div>

            {showNewTaskForm && (
              <div className="border rounded-md p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask()
                      if (e.key === "Escape") {
                        e.preventDefault()
                        setShowNewTaskForm(false)
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                    Add
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setShowNewTaskForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Press Enter to add or Escape to cancel. Default dates and assignee will be applied.
                </p>
              </div>
            )}

            <div className="border rounded-md divide-y">
              {editedCard.tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tasks added yet</p>
              ) : (
                editedCard.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 hover:bg-gray-50 ${selectedTaskId === task.id ? "bg-gray-50 ring-2 ring-blue-200" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => handleTaskCompletionChange(task.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Input
                          value={task.title}
                          onChange={(e) => handleUpdateTask(task.id, "title", e.target.value)}
                          className={`${task.completed ? "text-gray-500" : ""} mb-2`}
                          onClick={() => setSelectedTaskId(task.id)}
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`start-${task.id}`} className="text-xs">
                              Start Time
                            </Label>
                            <Input
                              id={`start-${task.id}`}
                              type="datetime-local"
                              value={task.startTime}
                              onChange={(e) => handleUpdateTask(task.id, "startTime", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end-${task.id}`} className="text-xs">
                              End Time
                            </Label>
                            <Input
                              id={`end-${task.id}`}
                              type="datetime-local"
                              value={task.endTime}
                              onChange={(e) => handleUpdateTask(task.id, "endTime", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Assignee Selection */}
                        <div>
                          <Label className="text-xs text-gray-500">Assignee</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full justify-start mt-1 text-xs">
                                {task.assignee ? (
                                  <>
                                    <Avatar className="h-4 w-4 mr-2">
                                      <AvatarFallback className="text-[8px]">
                                        {getInitials(task.assignee)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {task.assignee}
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    Unassigned
                                  </>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search team members..." />
                                <CommandList>
                                  <CommandEmpty>No results found</CommandEmpty>
                                  <CommandGroup>
                                    {teamMembers.map((member) => (
                                      <CommandItem
                                        key={member}
                                        onSelect={() => {
                                          handleUpdateTask(task.id, "assignee", member)
                                        }}
                                        className="cursor-pointer"
                                      >
                                        <Avatar className="h-5 w-5 mr-2">
                                          <AvatarFallback className="text-[10px]">{getInitials(member)}</AvatarFallback>
                                        </Avatar>
                                        {member}
                                        {task.assignee === member && <CheckCircle2 className="ml-auto h-4 w-4" />}
                                      </CommandItem>
                                    ))}
                                    <CommandItem
                                      onSelect={() => handleUpdateTask(task.id, "assignee", "Unassigned")}
                                      className="cursor-pointer"
                                    >
                                      <Circle className="h-5 w-5 mr-2" />
                                      Unassigned
                                      {task.assignee === "Unassigned" && <CheckCircle2 className="ml-auto h-4 w-4" />}
                                    </CommandItem>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}