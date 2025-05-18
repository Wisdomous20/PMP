"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchUpdateImplementationPlan from "@/domains/implementation-plan/services/fetchUpdateImplementationPlan";
import fetchUpdateImplementationPlanStatus from "@/domains/implementation-plan/services/fetchUpdateImplementationPlanStatus";
import { Progress } from "@/components/ui/progress";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

interface EditImplementationPlanProps {
  serviceRequest: ServiceRequest;
  tasksInitial: Task[];
  plan: ImplementationPlan;
  progress: number;
}

export default function EditImplementationPlan({
  serviceRequest,
  tasksInitial,
  plan,
  progress
}: EditImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksInitial);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await fetch("/api/manpower-management");
        const data = await response.json();
        if (Array.isArray(data)) {
          setPersonnel(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching personnel:", error);
      }
    };
    fetchPersonnel();
  }, []);

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  async function handleUpdateImplementationPlan() {
    setIsUpdating(true);
    try {
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
        checked: task.checked,
      }));

      await fetchUpdateImplementationPlan(serviceRequest.id, formattedTasks);

      const transformedAssignments = assignments.map((assignment) => {
        const task = tasks.find((t) => t.id === assignment.taskId);
        if (!task) {
          throw new Error(
            `Task with id ${assignment.taskId} not found for assignment`
          );
        }
        return {
          task: {
            name: task.name,
            startTime: task.startTime.toISOString(),
            endTime: task.endTime.toISOString(),
          },
          personnelId: assignment.personnelId,
          assignedAt: assignment.assignedAt.toISOString(),
        };
      });

      if (transformedAssignments.length > 0) {
        await fetch("/api/implementation-plan/assign-personnel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            implementationPlanId: plan.id,
            assignments: transformedAssignments,
          }),
        });
      }

      // Auto-complete the implementation plan if all tasks are checked
      const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.checked);
      if (allTasksCompleted) {
        await fetchUpdateImplementationPlanStatus(serviceRequest.id, "completed");
        console.log("Implementation Plan automatically marked as completed");
      }

      console.log("Implementation Plan updated successfully");
    } catch (error) {
      console.error("Failed to update implementation plan:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card key={plan.id} className="border-2 hover:cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-100 hover:border-gray-500 shadow-none">
          <CardHeader className="flex flex-col p-3 pb-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 truncate">{serviceRequest?.concern || "No Concern"}</h3>
            </div>
            <p className="text-xs text-gray-500 truncate">{serviceRequest?.details || "No Details"}</p>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="text-xs text-gray-500 mb-1.5 flex justify-between">
              <span>{plan.tasks.length} Tasks</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5"
            />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="min-w-[50vw] max-h-[90vh] flex flex-col overflow-y-scroll">
        <h1 className="text-lg font-semibold text-gray-800">
          {serviceRequest.concern}
        </h1>
        <div>
          <p className="text-sm text-muted-foreground">
            Name of requester
          </p>
          <p className="font-medium">{serviceRequest.user.firstName} {serviceRequest.user.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Details of the Request
          </p>
          <p className="font-medium">{serviceRequest.details}</p>
        </div>
        <div className="mt-2">
          <div className="flex flex-row w-full items-center justify-between">
            <p className="font-semibold text-gray-800">Tasks</p>
            <AddTask
              onAdd={handleAddTask}
              personnel={personnel}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          </div>
          <Separator className="my-2" />
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No tasks added yet</p>
              <p className="text-sm text-gray-400">Create tasks to build your implementation plan</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={removeTask}
                  personnel={personnel}
                  assignments={assignments}
                  setAssignments={setAssignments}
                  hasCheckbox={true}
                  onCheckChange={() =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id ? { ...t, checked: !t.checked } : t
                      )
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleUpdateImplementationPlan}
            className="bg-yellow-400 hover:bg-yellow-500 text-white"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Implementation Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  hasCheckbox?: boolean;
  onCheckChange?: () => void;
}

function TaskCard({
  task,
  onUpdate,
  onDelete,
  personnel,
  assignments,
  setAssignments,
  hasCheckbox = false,
  onCheckChange
}: TaskCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hasCheckbox && (
        <Checkbox
          checked={task.checked}
          onCheckedChange={onCheckChange}
          aria-label="Confirm task"
        />
      )}
      <div className="flex-grow p-1 rounded">
        <div className={`text-sm font-medium ${task.checked ? "line-through text-gray-400" : ""}`}>
          {task.name}
        </div>
        <div className={`text-xs text-muted-foreground ${task.checked ? "line-through text-gray-400" : ""}`}>
          Start: {task.startTime.toLocaleString()} | End:{" "}
          {task.endTime.toLocaleString()}
        </div>
      </div>
      {hover && (
        <EditTask
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          personnel={personnel}
          assignments={assignments}
          setAssignments={setAssignments}
        />
      )}
    </motion.div>
  );
}