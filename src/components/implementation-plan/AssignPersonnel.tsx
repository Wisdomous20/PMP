// AssignPersonnelDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  name: string;
}

interface Personnel {
  id: string;
  name: string;
  department?: string;
  position?: string;
}

interface AssignPersonnelProps {
  tasks: Task[];
  personnel: Personnel[];
  onAssign: (
    taskId: string,
    personnelId: string,
    start: Date,
    end: Date
  ) => void;
}

export default function AssignPersonnel({
  tasks,
  personnel,
  onAssign,
}: AssignPersonnelProps) {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedTask || !selectedPersonnel || !startDateTime || !endDateTime) {
      // You could add more robust error handling/validation here.
      alert("Please fill in all fields.");
      return;
    }
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    onAssign(selectedTask, selectedPersonnel, start, end);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Personnel</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Personnel to Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Select Task */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Select Task
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select a task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Personnel */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Select Personnel
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={selectedPersonnel}
              onChange={(e) => setSelectedPersonnel(e.target.value)}
            >
              <option value="">Select personnel</option>
              {personnel.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Start Date &amp; Time
            </label>
            <Input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              End Date &amp; Time
            </label>
            <Input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Assign</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
