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
import { Plus } from "lucide-react";

interface AddTaskProps {
  onAdd: (task: Task) => void;
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}


export default function AddTask({
  onAdd,
  personnel,
  assignments,
  setAssignments,
}: AddTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskStart, setTaskStart] = useState("");
  const [taskEnd, setTaskEnd] = useState("");
  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");

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
    const newAssignment: Assignment = {
      taskId: newTask.id,
      personnelId: selectedPersonnelId,
      assignedAt: new Date(),
    };
    setAssignments([...assignments, newAssignment]);
    onAdd(newTask);
    setTaskName("");
    setTaskStart("");
    setTaskEnd("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8"
        >
          <Plus className="h-3 w-3 mr-1" /> <p className="font-medium">Add Task</p>
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
              maxLength={500}
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
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Select Personnel
            </label>
            <select
              value={selectedPersonnelId}
              onChange={(e) => setSelectedPersonnelId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select personnel</option>
              {personnel.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.position}
                </option>
              ))}
            </select>
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
