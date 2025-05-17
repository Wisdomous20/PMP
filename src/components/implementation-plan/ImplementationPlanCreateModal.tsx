"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash, Plus, X, User, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CheckCircle2, Circle } from "lucide-react"
import type { ImplementationPlanCard as ModalImplementationPlanCard, FrontendTask as ModalTask } from "./ImplementationPlansBoardNew"
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan"

interface CreateImplementationPlanModalProps {
  concern: string,
  description:string,
  teamMembers: string[]
  serviceRequestId: string
}

export default function CreateImplementationPlanModal({
  concern,
  description,
  teamMembers = ["Alex Chen", "Sarah Johnson", "Michael Wong", "Emily Davis", "Jordan Smith", "Taylor Brown"],
  serviceRequestId,
}: CreateImplementationPlanModalProps) {
  const [editedCard, setEditedCard] = useState<Omit<ModalImplementationPlanCard, 'id'>>({
    concern: concern,
    description: description,
    tasks: [],
    serviceRequestId: serviceRequestId
  })
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)


  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const newTask: ModalTask = {
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

  const handleUpdateTask = (taskId: string, field: keyof ModalTask, value: string | boolean) => {
    setEditedCard({
      ...editedCard,
      tasks: editedCard.tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task)),
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const tasksToSave: Task[] = editedCard.tasks.map(task => ({
        id: task.id,
        name: task.title,
        startTime: new Date(task.startTime),
        endTime: new Date(task.endTime),
        checked: task.completed,
      }));

      await fetchCreateImplementationPlan(serviceRequestId, tasksToSave)

      
    } catch (error) {
      console.error("Failed to create implementation plan:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while saving the plan."
      setSaveError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape" && !showNewTaskForm) {
      e.preventDefault()
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
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Create Implementation Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Create Implementation Plan</DialogTitle>
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
                  disabled={isSaving}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>

              {editedCard.tasks.length > 0 ? (
                <div className="space-y-2 border rounded-md p-3">
                  {editedCard.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2 group">
                      <div className="flex-1">
                        <div className="text-sm cursor-pointer" onClick={() => { setSelectedTaskId(task.id); setActiveTab("tasks"); }}>
                          {task.title}
                        </div>
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
                        disabled={isSaving}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
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
                    disabled={isSaving}
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
                disabled={isSaving || showNewTaskForm}
              >
                <Plus className="h-3 w-3" /> Add Task
              </Button>
            </div>

            {showNewTaskForm && (
              <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
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
                        setNewTaskTitle("")
                      }
                    }}
                    disabled={isSaving}
                  />
                  <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim() || isSaving}>
                    Add
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { setShowNewTaskForm(false); setNewTaskTitle(""); }} disabled={isSaving}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter to add or Escape to cancel. Default dates and assignee will be applied.
                </p>
              </div>
            )}

            <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700">
              {editedCard.tasks.length === 0 && !showNewTaskForm ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No tasks added yet</p>
              ) : (
                editedCard.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${selectedTaskId === task.id ? "bg-gray-50 dark:bg-gray-800/50 ring-2 ring-blue-500 dark:ring-blue-400" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={task.title}
                          onChange={(e) => handleUpdateTask(task.id, "title", e.target.value)}
                          className="text-sm"
                          onClick={() => setSelectedTaskId(task.id)}
                          disabled={isSaving}
                          placeholder="Task Title"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`start-${task.id}`} className="text-xs">Start Time</Label>
                            <Input
                              id={`start-${task.id}`}
                              type="datetime-local"
                              value={task.startTime}
                              onChange={(e) => handleUpdateTask(task.id, "startTime", e.target.value)}
                              disabled={isSaving}
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end-${task.id}`} className="text-xs">End Time</Label>
                            <Input
                              id={`end-${task.id}`}
                              type="datetime-local"
                              value={task.endTime}
                              onChange={(e) => handleUpdateTask(task.id, "endTime", e.target.value)}
                              disabled={isSaving}
                              className="text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500 dark:text-gray-400">Assignee</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full justify-start mt-1 text-xs font-normal" disabled={isSaving}>
                                {task.assignee && task.assignee !== "Unassigned" ? (
                                  <>
                                    <Avatar className="h-4 w-4 mr-2">
                                      <AvatarFallback className="text-[8px]">{getInitials(task.assignee)}</AvatarFallback>
                                    </Avatar>
                                    {task.assignee}
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                                    Unassigned
                                  </>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search team..." />
                                <CommandList>
                                  <CommandEmpty>No results found.</CommandEmpty>
                                  <CommandGroup>
                                    {teamMembers.map((member) => (
                                      <CommandItem
                                        key={member}
                                        value={member}
                                        onSelect={(currentValue) => {
                                          handleUpdateTask(task.id, "assignee", currentValue === task.assignee ? "Unassigned" : currentValue)
                                          // Close popover after selection
                                          const trigger = document.activeElement as HTMLElement | null;
                                          trigger?.closest('[role="dialog"]')?.querySelector<HTMLElement>(`[cmdk-input]`)?.blur(); // A bit hacky to close popover
                                        }}
                                        className="cursor-pointer text-xs"
                                      >
                                        <Avatar className="h-5 w-5 mr-2">
                                          <AvatarFallback className="text-[10px]">{getInitials(member)}</AvatarFallback>
                                        </Avatar>
                                        {member}
                                        {task.assignee === member && <CheckCircle2 className="ml-auto h-4 w-4 text-blue-600" />}
                                      </CommandItem>
                                    ))}
                                    <CommandItem
                                      onSelect={() => handleUpdateTask(task.id, "assignee", "Unassigned")}
                                      className="cursor-pointer text-xs"
                                    >
                                      <Circle className="h-5 w-5 mr-2 text-gray-400" />
                                      Unassigned
                                      {task.assignee === "Unassigned" && <CheckCircle2 className="ml-auto h-4 w-4 text-blue-600" />}
                                    </CommandItem>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} disabled={isSaving} className="mt-1">
                        <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
          {saveError && <p className="text-sm text-red-500 dark:text-red-400 w-full sm:w-auto text-left sm:text-right sm:mr-auto">{saveError}</p>}
          <div className="flex gap-2">
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || editedCard.tasks.length === 0}>
              {isSaving ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}