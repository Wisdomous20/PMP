// CreateImplementationPlan.tsx
"use client";

import { useState } from "react";
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
import EquipmentTable from "../equipment-management/EquipmentManagement";
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan";
import formatTimestamp from "@/utils/formatTimestamp";
import { fetchInProgressStatus } from "@/domains/service-request/services/status/fetchAddSatus";
import refreshPage from "@/utils/refreshPage";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

interface CreateImplementationPlanProps {
  serviceRequest: ServiceRequest;
}

export default function CreateImplementationPlan({
  serviceRequest,
}: CreateImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);

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

  async function handleCreateImplementationPlan() {
    setIsLoading(true);
    try {
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
        checked: task.checked,
      }));

      const response = await fetchCreateImplementationPlan(
        serviceRequest.id,
        formattedTasks
      );
      await fetchInProgressStatus(
        serviceRequest.id,
        "Implementation plan created"
      );
      console.log("Plan creation response:", response);
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
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create Implementation Plan</DialogTitle>
        </DialogHeader>
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
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
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">
                      {formatTimestamp(serviceRequest.createdOn)}
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center"
                  >
                    <span>People Assigned</span>
                  </Button>
                  {/* Equipment / Budget Button */}
                  <Dialog
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
                      <EquipmentTable serviceRequestId={serviceRequest.id} />
                    </DialogContent>
                  </Dialog>
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
