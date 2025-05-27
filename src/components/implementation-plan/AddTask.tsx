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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [errors, setErrors] = useState<{
    name?: string;
    start?: string;
    end?: string;
    personnel?: string;
    datespan?: string;
  }>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const getMaxEndDate = () => {
    if (!taskStart) return maxDateString;

    const startDate = new Date(taskStart);
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + 7);
    return maxEndDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      start?: string;
      end?: string;
      personnel?: string;
      datespan?: string;
    } = {};

    if (!taskName) newErrors.name = "Task name is required";
    if (!taskStart) newErrors.start = "Start date is required";
    if (!taskEnd) newErrors.end = "End date is required";
    if (!selectedPersonnelId) newErrors.personnel = "Personnel selection is required";

    if (taskStart && taskEnd) {
      const startDate = new Date(taskStart);
      const endDate = new Date(taskEnd);
      const todayDate = new Date(today);

      if (startDate < todayDate) {
        newErrors.start = "Start date cannot be in the past";
      }

      if (endDate < startDate) {
        newErrors.end = "End date cannot be before start date";
      }

      const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference > 7) {
        newErrors.datespan = "Task duration cannot exceed 7 days";
      }
    }

    return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    const { errors: validationErrors, isValid } = validateForm();
    setErrors(validationErrors);

    if (!isValid) return;

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

    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTaskName("");
    setTaskStart("");
    setTaskEnd("");
    setSelectedPersonnelId("");
    setErrors({});
    setAttemptedSubmit(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8">
          <Plus className="h-3 w-3 mr-1" /> <p className="font-medium">Add Task</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Task Name
            </label>
            <Input
              type="text"
              value={taskName}
              maxLength={250}
              onChange={(e) => setTaskName(e.target.value)}
              className={attemptedSubmit && errors.name ? "border-red-500" : ""}
            />
            {attemptedSubmit && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={taskStart}
              min={today}
              max={maxDateString}
              onChange={(e) => setTaskStart(e.target.value)}
              className={attemptedSubmit && errors.start ? "border-red-500" : ""}
            />
            {attemptedSubmit && errors.start && (
              <p className="text-sm text-red-500 mt-1">{errors.start}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={taskEnd}
              min={today}
              max={getMaxEndDate()}
              onChange={(e) => setTaskEnd(e.target.value)}
              className={attemptedSubmit && errors.end ? "border-red-500" : ""}
            />
            {attemptedSubmit && errors.end && (
              <p className="text-sm text-red-500 mt-1">{errors.end}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Select Personnel
            </label>
            <Select
              value={selectedPersonnelId}
              onValueChange={setSelectedPersonnelId}
            >
              <SelectTrigger className={attemptedSubmit && errors.personnel ? "border-red-500" : ""}>
                <SelectValue placeholder="Select personnel" />
              </SelectTrigger>
              <SelectContent>
                {personnel.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="hover:cursor-pointer border border-transparent hover:border-gray-800">
                    {p.name} - {p.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {attemptedSubmit && errors.personnel && (
              <p className="text-sm text-red-500 mt-1">{errors.personnel}</p>
            )}
          </div>

          {attemptedSubmit && errors.datespan && (
            <Alert variant="destructive">
              <AlertDescription>{errors.datespan}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}