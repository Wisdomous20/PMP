"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan"
import formatTimestamp from "@/utils/formatTimestamp"
import { fetchInProgressStatus } from "@/domains/service-request/services/status/fetchAddSatus"
import refreshPage from "@/utils/refreshPage"

interface Task {
  id: string
  name: string
  deadline: Date
  isEditing: boolean
}

interface CreateImplementationPlanProps {
  serviceRequest: ServiceRequest
}

export default function CreateImplementationPlan({ serviceRequest }: CreateImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: "Initial Task",
      deadline: new Date('2023-12-20'),
      isEditing: false
    } 
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: "New Task",
      deadline: new Date(),
      isEditing: false
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, value: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, name: value } : task
    ))
  }

  const toggleEditing = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isEditing: !task.isEditing } : task
    ))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  async function handleCreateImplementationPlan() {
    setIsLoading(true)
    try {
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        deadline: task.deadline,
        checked: false
      }))

      const response = await fetchCreateImplementationPlan(serviceRequest.id, formattedTasks)
      await fetchInProgressStatus(serviceRequest.id, 'Implementation plan created')
      console.log('Plan creation response:', response)
      refreshPage()

    } catch (error) {
      console.error('Failed to create implementation plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white hover:text-white">
          Create Implementation Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create Implementation Plan</DialogTitle>
        </DialogHeader>
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="space-y-6 md:col-span-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name of requester</p>
                  <p className="font-medium">{serviceRequest.requesterName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Concern</p>
                  <p className="font-medium">{serviceRequest.concern}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Details of the Request</p>
                  <p className="font-medium">{serviceRequest.details}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-semibold">Tasks</p>

                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="flex-grow p-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleEditing(task.id)}
                      >
                        {task.isEditing ? (
                          <Input
                            value={task.name}
                            onChange={(e) => updateTask(task.id, e.target.value)}
                            onBlur={() => toggleEditing(task.id)}
                            autoFocus
                          />
                        ) : (
                          <span>
                            {task.name}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addTask}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                {serviceRequest.createdOn &&
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">{formatTimestamp(serviceRequest.createdOn)}</p>
                  </div>
                }
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <span>People Assigned</span>
                  </Button>

                  <Button variant="outline" className="w-full h-24 flex items-center justify-center">
                    <span>Equipment / Budget</span>
                  </Button>

                  <Button
                    onClick={handleCreateImplementationPlan}
                    className={`w-full mt-4 ${isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Confirm'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
