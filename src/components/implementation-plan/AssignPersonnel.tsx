// AssignPersonnel.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TaskInfo {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
}

interface AssignPersonnelProps {
  tasks: TaskInfo[];
  personnel: Personnel[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export default function AssignPersonnel({
  tasks,
  personnel,
  assignments,
  setAssignments,
}: AssignPersonnelProps) {
  // Outer dialog state to show assignments list
  const [isMainOpen, setIsMainOpen] = useState(false);
  // Nested dialog state for adding a new assignment
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");

  const handleAddSubmit = () => {
    if (!selectedTaskId || !selectedPersonnelId) {
      alert("Please select both a task and a personnel member.");
      return;
    }
    const newAssignment: Assignment = {
      taskId: selectedTaskId,
      personnelId: selectedPersonnelId,
      assignedAt: new Date(),
    };
    setAssignments([...assignments, newAssignment]);
    setSelectedTaskId("");
    setSelectedPersonnelId("");
    setIsNestedOpen(false);
  };

  const handleDeleteAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={isMainOpen} onOpenChange={setIsMainOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-24">Personnel Assignment</Button>
        </DialogTrigger>
        <DialogContent className="min-w-[50vw]">
          <DialogHeader>
            <DialogTitle>Personnel Assignments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignments yet.
              </p>
            ) : (
              <div className="space-y-2">
                {assignments.map((assignment, index) => {
                  const task = tasks.find((t) => t.id === assignment.taskId);
                  const person = personnel.find(
                    (p) => p.id === assignment.personnelId
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded shadow-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {task ? task.name : "Unknown Task"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {person
                            ? `${person.name} (${person.position})`
                            : "Unknown Personnel"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task
                            ? `Time: ${task.startTime.toLocaleString()} - ${task.endTime.toLocaleString()}`
                            : "Unknown Time"}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAssignment(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setIsNestedOpen(true)}>
                Add Personnel
              </Button>
            </div>
            {/* Nested dialog for adding assignment */}
            <Dialog open={isNestedOpen} onOpenChange={setIsNestedOpen}>
              <DialogTrigger asChild>
                {/* Invisible trigger – the button above opens the nested dialog */}
                <span className="hidden" />
              </DialogTrigger>
              <DialogContent className="min-w-[40vw]">
                <DialogHeader>
                  <DialogTitle>Add Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Select Task
                    </label>
                    <select
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">Select a task</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.name} (
                          {task.startTime.toLocaleString()} -{" "}
                          {task.endTime.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Select Personnel
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
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNestedOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSubmit}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}