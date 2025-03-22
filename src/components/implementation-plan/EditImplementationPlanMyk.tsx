"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchUpdateImplementationPlan from "@/domains/implementation-plan/services/fetchUpdateImplementationPlan";
import fetchUpdateImplementationPlanStatus from "@/domains/implementation-plan/services/fetchUpdateImplementationPlanStatus";
// import formatTimestamp from "@/utils/formatTimestamp";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

interface EditImplementationPlanProps {
  serviceRequest: ServiceRequest;
  tasksInitial: Task[];
}

export default function EditImplementationPlan({
  serviceRequest,
  tasksInitial,
}: EditImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksInitial);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      console.log("Implementation Plan updated successfully");
    } catch (error) {
      console.error("Failed to update implementation plan:", error);
    } finally {
      setIsUpdating(false);
    }
  }

async function handleCompleteImplementationPlan() {
    setIsUpdating(true);
    try {
      await fetchUpdateImplementationPlanStatus(serviceRequest.id, "completed");
      console.log("Implementation Plan marked as completed");
    } catch (error) {
      console.error("Failed to mark implementation plan as completed:", error);
    } finally {
      setIsUpdating(false);
    }
    
    // Update the implementation plan with the current tasks
    const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
        checked: task.checked,
    }));

    await fetchUpdateImplementationPlan(serviceRequest.id, formattedTasks);
    console.log("Implementation Plan updated successfully");

  }

const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.checked);
    
    // This will be used to determine if the "Mark as Completed" button should be shown


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white mt-2"
        >
          Edit Implementation Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Edit Implementation Plan</DialogTitle>
        </DialogHeader>
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-6 md:col-span-2">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Name of requester</span>
                  <div className="font-medium">{serviceRequest.requesterName}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Concern</span>
                  <div className="font-medium">{serviceRequest.concern}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Details of the Request</span>
                  <div className="font-medium">{serviceRequest.details}</div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <p className="font-semibold">Tasks</p>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="flex-grow p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <div className="font-bold">{task.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {task.startTime.toLocaleString()} - {task.endTime.toLocaleString()}
                        </div>
                      </div>
                      <EditTask task={task} onUpdate={handleUpdateTask} />
                      <Checkbox
                        checked={task.checked}
                        onCheckedChange={() =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, checked: !t.checked } : t
                            )
                          )
                        }
                        aria-label="Confirm task"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeTask(task.id)}
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  ))}
                  <AddTask onAdd={handleAddTask} />
                </div>
              </div>
              <div className="space-y-6">
                <Button
                  onClick={handleUpdateImplementationPlan}
                  className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Implementation Plan"}
                </Button>
                {allTasksCompleted && (
                  <Button
                    onClick={handleCompleteImplementationPlan}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Completing..." : "Mark as Completed"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
