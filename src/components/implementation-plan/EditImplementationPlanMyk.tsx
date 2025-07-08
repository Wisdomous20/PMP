"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog";
import {
  updateImplementationPlan,
  updateImplementationPlanStatus
} from "@/lib/implementation-plan/update-implementation-plan";
import {
  getPersonnelAssignmentsByImplementationPlanId,
  type PersonnelAssignment
} from "@/lib/personnel/get-personnel-assignment";
import {Progress} from "@/components/ui/progress";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import {getPersonnel} from "@/lib/personnel/get-personnel";
import {Skeleton} from "@/components/ui/skeleton";
import {addPersonnelToTask} from "@/lib/personnel/assign-personnel";
import {removePersonnelFromTask} from "@/lib/personnel/remove-personnel";
import {ErrorCodes} from "@/lib/ErrorCodes";

interface EditImplementationPlanProps {
  serviceRequest: ServiceRequest;
  tasksInitial: Task[];
  plan: ImplementationPlan;
  progress: number;
  userRole: UserRole
  onUpdateAction: () => Promise<void>
}

export default function EditImplementationPlan({
  serviceRequest,
  tasksInitial,
  plan,
  progress,
  userRole,
  onUpdateAction
}: EditImplementationPlanProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksInitial);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>();
  const [personnelAssignments, setPersonnelAssignments] = useState<PersonnelAssignment>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllStuff(id: string) {
      const personnel = await getPersonnel();
      const personnelAssignments = await getPersonnelAssignmentsByImplementationPlanId(id);

      if (personnel.data && personnelAssignments.data) {
        setPersonnel(personnel.data);
        setPersonnelAssignments(personnelAssignments.data);

        const assignments = personnelAssignments.data.map(assignment => ({
          taskId: assignment.taskId,
          personnelId: assignment.personnelId,
          assignedAt: new Date(assignment.assignedAt!),
        }));
        setAssignments(assignments);
      }
    }

    getAllStuff(plan.id)
      .then(() => setLoading(false));
  }, [plan]);

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

      const result = await updateImplementationPlan(serviceRequest.id, formattedTasks);
      if (result.code !== ErrorCodes.OK) {
        setIsUpdating(false);

        console.log(result, serviceRequest.id);

        // TODO: Show error on failure
        return;
      }

      const initialAssignmentMap = new Map();
      if (personnelAssignments) {
        personnelAssignments.forEach(assignment => {
          initialAssignmentMap.set(assignment.taskId, assignment.personnelId);
        });
      }

      const modifiedOrNewAssignments = assignments.filter(assignment => {
        const initialPersonnelId = initialAssignmentMap.get(assignment.taskId);
        return initialPersonnelId !== assignment.personnelId;
      });

      const removedAssignments: { taskId: string; personnelId: string; }[] = [];
      initialAssignmentMap.forEach((personnelId, taskId) => {
        const stillExists = assignments.some(a =>
          a.taskId === taskId && a.personnelId === personnelId
        );
        if (!stillExists) {
          removedAssignments.push({ taskId, personnelId });
        }
      });

      for (const { taskId, personnelId } of removedAssignments) {
        try {
          await removePersonnelFromTask(taskId, personnelId)
        } catch (error) {
          console.error(`Failed to remove personnel from task ${taskId}:`, error);
        }
      }

      for (const assignment of modifiedOrNewAssignments) {
        const task = tasks.find(t => t.id === assignment.taskId);
        if (!task) continue;

        try {
          // Use the task id for creation instead
          const taskId = result.data?.created && result?.data.id
            ? result.data?.id
            : assignment.taskId;
          await addPersonnelToTask(taskId, assignment.personnelId)
        } catch (error) {
          console.error(`Failed to assign personnel to task ${assignment.taskId}:`, error);
        }
      }

      const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.checked);
      if (allTasksCompleted) {
        await updateImplementationPlanStatus(serviceRequest.id, "completed");
      }
    } catch (error) {
      console.error("Failed to update implementation plan:", error);
    } finally {
      await onUpdateAction();
      setIsUpdating(false);
      setIsDialogOpen(false);
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
          <p className="font-medium">{serviceRequest.user!.firstName} {serviceRequest.user!.lastName}</p>
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
            {/* Show loading state for AddTask button */}
            {isLoading ? (
              <Skeleton className="h-9 w-[120px]" />
            ) : (
              (userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                <AddTask
                  onAdd={handleAddTask}
                  personnel={personnel ? personnel : []}
                  assignments={assignments}
                  setAssignments={setAssignments}
                />
              )
            )}
          </div>
          <Separator className="my-2" />

          {isLoading ? (
            // Loading state for tasks with skeleton components
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2 p-2 border border-gray-100 rounded-md">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
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
                  plan={plan}
                  onUpdate={handleUpdateTask}
                  onDelete={removeTask}
                  personnel={personnel ? personnel : []}
                  assignments={assignments}
                  setAssignments={setAssignments}
                  hasCheckbox={true}
                  userRole={userRole}
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
        {/* Improved loading state for action buttons */}
        {isLoading ? (
          <div className="flex justify-end gap-2 mt-4">
            <Skeleton className="h-10 w-[200px]" />
          </div>
        ) : (
          (userRole === "ADMIN" || userRole === "SUPERVISOR") && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={handleUpdateImplementationPlan}
                className="bg-yellow-400 hover:bg-yellow-500 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Implementation Plan"}
              </Button>
            </div>
          )
        )}
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
  userRole: UserRole
  plan: ImplementationPlan
}

function TaskCard({
  task,
  onUpdate,
  onDelete,
  personnel,
  assignments,
  setAssignments,
  hasCheckbox = false,
  onCheckChange,
  userRole,
  plan
}: TaskCardProps) {
  const currentAssignment = assignments.find(a => a.taskId === task.id);
  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2"
    >
      {(hasCheckbox && (userRole == "ADMIN" || userRole == "SUPERVISOR")) && (
        <Checkbox
          checked={task.checked}
          onCheckedChange={onCheckChange}
          aria-label="Confirm task"
        />
      )}
      <div className="flex-grow p-1 rounded max-w-full">
        <div className={`text-sm font-medium break-words whitespace-normal ${task.checked ? "line-through text-gray-400" : ""}`}>
          {task.name}
        </div>
        <div className={`text-xs text-muted-foreground break-words whitespace-normal ${task.checked ? "line-through text-gray-400" : ""}`}>
          Start: {task.startTime.toLocaleString()} | End:{" "}
          {task.endTime.toLocaleString()}
        </div>
      </div>
      {(userRole === "SUPERVISOR" || userRole === "ADMIN") &&
        <EditTask
          task={task}
          implementationPlan={plan}
          onUpdate={onUpdate}
          onDelete={onDelete}
          personnel={personnel}
          assignments={assignments}
          setAssignments={setAssignments}
          currentAssignment={currentAssignment}
        />
      }
    </motion.div>
  );
}
