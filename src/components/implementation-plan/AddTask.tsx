// AddTaskDialog.tsx
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
import { PlusCircle } from "lucide-react";

interface AddTaskProps {
  onAdd: (task: Task) => void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskStart, setTaskStart] = useState("");
  const [taskEnd, setTaskEnd] = useState("");

  const handleSubmit = () => {
    if (!taskName || !taskStart || !taskEnd) {
      alert("Please fill in all fields for the task.");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      startTime: new Date(taskStart),
      endTime: new Date(taskEnd),
      checked: false,
    };
    onAdd(newTask);
    // Reset fields and close dialog
    setTaskName("");
    setTaskStart("");
    setTaskEnd("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
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
            <Button onClick={handleSubmit}>Add Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
