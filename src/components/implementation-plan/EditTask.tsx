"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash } from "lucide-react";

interface EditTaskProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export default function EditTask({ 
  task, 
  onUpdate, 
  onDelete, 
  personnel,
  assignments,
  setAssignments 
}: EditTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const initialStart = new Date(task.startTime).toLocaleString("sv-SE", { timeZone: "Asia/Manila" }).slice(0, 16);
  const initialEnd = new Date(task.endTime).toLocaleString("sv-SE", { timeZone: "Asia/Manila" }).slice(0, 16);  
  const [taskStart, setTaskStart] = useState(initialStart);
  const [taskEnd, setTaskEnd] = useState(initialEnd);
  
  // Find current assignment for this task
  const currentAssignment = assignments.find(a => a.taskId === task.id);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(currentAssignment?.personnelId || "");

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
    
    // Update assignment if personnel changed
    if (currentAssignment && currentAssignment.personnelId !== selectedPersonnelId) {
      // Remove old assignment
      const filteredAssignments = assignments.filter(a => a.taskId !== task.id);
      
      // Add new assignment if a personnel is selected
      if (selectedPersonnelId) {
        const newAssignment: Assignment = {
          taskId: task.id,
          personnelId: selectedPersonnelId,
          assignedAt: new Date(),
        };
        setAssignments([...filteredAssignments, newAssignment]);
      } else {
        setAssignments(filteredAssignments);
      }
    } 
    // Create new assignment if none existed before
    else if (!currentAssignment && selectedPersonnelId) {
      const newAssignment: Assignment = {
        taskId: task.id,
        personnelId: selectedPersonnelId,
        assignedAt: new Date(),
      };
      setAssignments([...assignments, newAssignment]);
    }
    
    setIsOpen(false);
  };

  const handleDeleteTask = () => {
    onDelete(task.id);
    
    // Also remove any assignment for this task
    const filteredAssignments = assignments.filter(a => a.taskId !== task.id);
    setAssignments(filteredAssignments);
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8 bg-white/80 hover:bg-gray-100 transition-colors"
          aria-label="Edit Task"
        >
          <Pencil className="w-4 h-4 text-gray-600" />
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Assigned Personnel
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
        </div>
        <DialogFooter className="flex justify-between items-center gap-2 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Update Task
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}