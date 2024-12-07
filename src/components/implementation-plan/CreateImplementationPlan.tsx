'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Task {
  id: number
  text: string
}

export default function CreateImplementationPlan() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, text: '' }])
  }

  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text } : task)))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Implementation Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Name of requester</Label>
                <Input id="name" />
              </div>
              <div>
                <Label htmlFor="date">Request Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title of Request</Label>
              <Input id="title" />
            </div>

            <div>
              <Label htmlFor="details">Details of the Request</Label>
              <Textarea id="details" className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label>Tasks</Label>
              {tasks.map((task) => (
                <Input
                  key={task.id}
                  value={task.text}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  placeholder="Enter task"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addTask}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Upload File</Label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
                <Input id="file" type="file" className="hidden" />
                <Label
                  htmlFor="file"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Click to upload or drag and drop
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="people">People Assigned</Label>
              <Textarea id="people" className="min-h-[100px]" />
            </div>

            <div>
              <Label htmlFor="budget">Equipment / Budget</Label>
              <Textarea id="budget" className="min-h-[100px]" />
            </div>

            <Button className="w-full bg-green-500 hover:bg-green-600">
              Confirm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

