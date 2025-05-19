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
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan";
import { fetchInProgressStatus } from "@/domains/service-request/services/status/fetchAddSatus";
import refreshPage from "@/utils/refreshPage";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import { useQuery } from "@tanstack/react-query";
import fetchGetpersonnel from "@/domains/personnel-management/service/fetchGetPersonnel";

interface CreateImplementationPlanProps {
  serviceRequest: ServiceRequest;
}

export default function CreateImplementationPlan({
  serviceRequest,
}: CreateImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: personnel } = useQuery({
    queryKey: ["personnel"],
    queryFn: () => fetchGetpersonnel()
  });

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
      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
        checked: task.checked,
      }));

      const planResponse = await fetchCreateImplementationPlan(
        serviceRequest.id,
        formattedTasks
      );
      const planId = planResponse.id;

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
      <DialogContent className="min-w-[50vw] max-h-[90vh] flex flex-col overflow-y-scroll">
        <h1 className="text-lg font-semibold text-gray-800">
          {serviceRequest.concern}
        </h1>
        <div>
          <p className="text-sm text-muted-foreground">
            Name of requester
          </p>
          <p className="font-medium">{serviceRequest.requesterName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Details of the Request
          </p>
          <p className="font-medium">{serviceRequest.details}</p>
        </div>
        <div className="mt-2 ">
          <div className="flex flex-row w-full items-center justify-between">
            <p className="font-semibold text-gray-800">Tasks</p>
            <AddTask
              onAdd={handleAddTask}
              personnel={personnel ? personnel : []}
              assignments={assignments}
              setAssignments={setAssignments} />
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
                  personnel={personnel ? personnel : []}
                  assignments={assignments}
                  setAssignments={setAssignments}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCreateImplementationPlan}
            disabled={isLoading || tasks.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Creating..." : "Save Implementation Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  );
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

function TaskCard({ task, onUpdate, onDelete, personnel, assignments, setAssignments }: TaskCardProps) {
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
      <div className="flex-grow p-1 rounded max-w-full">
        <div className={`text-sm font-medium break-words whitespace-normal ${task.checked ? "line-through text-gray-400" : ""}`}>
          {task.name}
        </div>
        <div className={`text-xs text-muted-foreground break-words whitespace-normal ${task.checked ? "line-through text-gray-400" : ""}`}>
          Start: {task.startTime.toLocaleString()} | End:{" "}
          {task.endTime.toLocaleString()}
        </div>
      </div>
      {hover &&
        <EditTask
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          personnel={personnel}
          assignments={assignments}
          setAssignments={setAssignments}
        />
      }
    </motion.div>
  )
}