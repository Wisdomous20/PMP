/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan";
import formatTimestamp from "@/utils/formatTimestamp";
import { fetchInProgressStatus } from "@/domains/service-request/services/status/fetchAddSatus";
import refreshPage from "@/utils/refreshPage";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import AssignPersonnel from "./AssignPersonnel";

// These types are based on your provided definitions.

interface CreateImplementationPlanProps {
  serviceRequest: ServiceRequest;
}

export default function CreateImplementationPlan({
  serviceRequest,
}: CreateImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);

  // Fetch personnel on mount
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
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  async function handleCreateImplementationPlan() {
    setIsLoading(true);
    try {
      // Format tasks for the API call
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
        checked: task.checked,
      }));

      // Create the implementation plan and get the created plan's ID
      const planResponse = await fetchCreateImplementationPlan(
        serviceRequest.id,
        formattedTasks
      );
      const planId = planResponse.id;

      // Transform assignments to the structure expected by the backend:
      // Each assignment now includes a nested "task" object with its name and ISO date strings.
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

      // If there are any assignments, send them via the dedicated API route.
      if (transformedAssignments.length > 0) {
        await fetch("/api/implementation-plan/assign-personnel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            implementationPlanId: planId,
            assignments: transformedAssignments,
          }),
        });
      }

      await fetchInProgressStatus(
        serviceRequest.id,
        "Implementation plan created"
      );
      console.log("Plan creation and assignments successful");
      refreshPage();
    } catch (error) {
      console.error("Failed to create implementation plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Create Implementation Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create Implementation Plan</DialogTitle>
        </DialogHeader>
        <Card className="w-full max-w-6xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Side: Request details and Tasks */}
              <div className="space-y-6 md:col-span-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Name of requester
                  </p>
                  <p className="font-medium">{serviceRequest.requesterName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Concern</p>
                  <p className="font-medium">{serviceRequest.concern}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Details of the Request
                  </p>
                  <p className="font-medium">{serviceRequest.details}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold">Tasks</p>
                  {tasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tasks added yet.
                    </p>
                  )}
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="flex-grow p-2 rounded bg-gray-50">
                        <div className="font-bold">{task.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Start: {task.startTime.toLocaleString()} | End:{" "}
                          {task.endTime.toLocaleString()}
                        </div>
                      </div>
                      <EditTask task={task} onUpdate={handleUpdateTask} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                  {/* Add Task Dialog */}
                  <AddTask onAdd={handleAddTask} />
                </div>
              </div>
              {/* Right Side: Miscellaneous Details */}
              <div className="space-y-6">
                {serviceRequest.createdOn && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Request Date
                    </p>
                    <p className="font-medium">
                      {formatTimestamp(serviceRequest.createdOn)}
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  {/* Personnel Assignment Section */}
                  <AssignPersonnel
                    tasks={tasks}
                    personnel={personnel}
                    assignments={assignments}
                    setAssignments={setAssignments}
                  />
                  {/* Equipment / Budget Button */}
                  {/* <Dialog
                    open={isEquipmentDialogOpen}
                    onOpenChange={setIsEquipmentDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-24 flex items-center justify-center"
                      >
                        <span>Equipment / Budget</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-scroll">
                      <DialogHeader>
                        <DialogTitle>Manage Equipment</DialogTitle>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                  <Button
                    onClick={handleCreateImplementationPlan}
                    className={`w-full mt-4 ${
                      isLoading
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
