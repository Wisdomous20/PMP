// EditTaskDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface EditTaskProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

export default function EditTask({ task, onUpdate }: EditTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const initialStart = new Date(task.startTime).toLocaleString("sv-SE", { timeZone: "Asia/Manila" }).slice(0, 16);
  const initialEnd = new Date(task.endTime).toLocaleString("sv-SE", { timeZone: "Asia/Manila" }).slice(0, 16);  
  const [taskStart, setTaskStart] = useState(initialStart);
  const [taskEnd, setTaskEnd] = useState(initialEnd);

  const handleSubmit = () => {
    if (!taskName || !taskStart || !taskEnd) {
      alert("Please fill in all fields for the task.");
      return;
    }
    const updatedTask: Task = {
      ...task,
      name: taskName,
      startTime: new Date(taskStart),
      endTime: new Date(taskEnd),
    };
    onUpdate(updatedTask);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit Task">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Task Name
            </label>
            <Input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Start Date &amp; Time
            </label>
            <Input
              type="datetime-local"
              value={taskStart}
              onChange={(e) => setTaskStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              End Date &amp; Time
            </label>
            <Input
              type="datetime-local"
              value={taskEnd}
              onChange={(e) => setTaskEnd(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
