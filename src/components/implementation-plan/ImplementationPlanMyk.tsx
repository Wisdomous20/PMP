'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Upload } from 'lucide-react'

interface Task {
  id: string
  name: string
  confirmed: boolean
  isEditing: boolean
}

export default function CreateImplementationPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: "Task 1", confirmed: false, isEditing: false },
  ])

  const addTask = () => {
    const newTask = { id: Date.now().toString(), name: "New Task", confirmed: false, isEditing: false }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, name: value } : task
    ))
  }

  const toggleConfirm = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, confirmed: !task.confirmed } : task
    ))
  }

  const toggleEditing = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isEditing: !task.isEditing } : task
    ))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name of requester</p>
              <p className="font-medium">John Doe</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Title of Request</p>
              <p className="font-medium">CCTV concern</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Details of the Request</p>
              <p className="font-medium">Engineering theft</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="font-semibold">Tasks</p>
              {tasks.map((task) => (
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
                      <span className={task.confirmed ? 'line-through text-gray-500' : ''}>
                        {task.name}
                      </span>
                    )}
                  </div>
                  <Checkbox
                    checked={task.confirmed}
                    onCheckedChange={() => toggleConfirm(task.id)}
                    aria-label="Confirm task"
                  />
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addTask}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add task
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="font-medium">15 Dec 2023</p>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 mb-2" />
                <span>Upload File</span>
              </Button>

              <Button variant="outline" className="w-full h-24 flex items-center justify-center">
                <span>People Assigned</span>
              </Button>

              <Button variant="outline" className="w-full h-24 flex items-center justify-center">
                <span>Equipment / Budget</span>
              </Button>
            </div>

            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

