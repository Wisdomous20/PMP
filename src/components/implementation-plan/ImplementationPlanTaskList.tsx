'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Task {
  id: number
  text: string
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, text: '' }])
  }

  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text } : task)))
  }

  return (
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
  )
}
