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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Trash } from "lucide-react";

interface EditTaskProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  currentAssignment?: Assignment;
  implementationPlan?: ImplementationPlan
}

export default function EditTask({
  task,
  onUpdate,
  onDelete,
  personnel,
  assignments,
  setAssignments,
  currentAssignment,
  implementationPlan
}: EditTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState(task.name);

  const initialStart = new Date(task.startTime).toISOString().split('T')[0];
  const initialEnd = new Date(task.endTime).toISOString().split('T')[0];
  const [taskStart, setTaskStart] = useState(initialStart);
  const [taskEnd, setTaskEnd] = useState(initialEnd);

  const [selectedPersonnelId, setSelectedPersonnelId] = useState(
    currentAssignment?.personnelId || ""
  );

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
  maxDate.setDate(maxDate.getDate() + 120);
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
    if (!selectedPersonnelId) newErrors.personnel = "Personnel assignment is required";

    if (taskStart && taskEnd) {
      const startDate = new Date(taskStart);
      const endDate = new Date(taskEnd);
      const todayDate = new Date(today);

      if (implementationPlan) {
        const planCreatedDate = new Date(implementationPlan.createdAt);
        const planCreatedDateString = planCreatedDate.toISOString().split('T')[0];

        if (taskStart < planCreatedDateString) {
          newErrors.start = "Start date must not be before implementation plan creation date";
        }
      } else {
        if (startDate < todayDate) {
          newErrors.start = "Start date cannot be in the past";
        }
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

    const updatedTask: Task = {
      ...task,
      name: taskName,
      startTime: new Date(taskStart),
      endTime: new Date(taskEnd),
    };
    onUpdate(updatedTask);

    const hasCurrentAssignment = Boolean(currentAssignment);
    const hasSelectedPersonnel = Boolean(selectedPersonnelId);

    if (hasCurrentAssignment &&
      (!hasSelectedPersonnel || currentAssignment?.personnelId !== selectedPersonnelId)) {
      const filteredAssignments = assignments.filter(a => a.taskId !== task.id);

      if (hasSelectedPersonnel) {
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
    else if (!hasCurrentAssignment && hasSelectedPersonnel) {
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

    const filteredAssignments = assignments.filter(a => a.taskId !== task.id);
    setAssignments(filteredAssignments);

    setIsOpen(false);
  };

  const resetForm = () => {
    setTaskName(task.name);
    setTaskStart(initialStart);
    setTaskEnd(initialEnd);
    setSelectedPersonnelId(currentAssignment?.personnelId || "");
    setErrors({});
    setAttemptedSubmit(false);
  };

  const getStartDateConstraints = () => {
    if (implementationPlan) {
      const planCreatedDate = new Date(implementationPlan.createdAt).toISOString().split('T')[0];
      return { min: planCreatedDate, max: planCreatedDate };
    }
    return { min: today, max: maxDateString };
  };

  const startDateConstraints = getStartDateConstraints();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
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
              min={startDateConstraints.min}
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
              min={taskStart || (implementationPlan ? new Date(implementationPlan.createdAt).toISOString().split('T')[0] : today)}
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
              Assigned Personnel
            </label>
            <Select
              value={selectedPersonnelId}
              onValueChange={setSelectedPersonnelId}
            >
              <SelectTrigger className={attemptedSubmit && errors.personnel ? "border-red-500" : ""}>
                <SelectValue placeholder="Select personnel" />
              </SelectTrigger>
              <SelectContent>
                {!personnel && <SelectItem value="none">None</SelectItem>}
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