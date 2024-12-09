/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Column from "./Column";
import Task from "./Task";
import useGetImplementationPlans from "@/domains/implementation-plan/hooks/useGetImplementationPlans";

type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

const initialColumns: ColumnType[] = [
  { id: "pending", title: "Pending", taskIds: [] },
  { id: "in_progress", title: "In Progress", taskIds: [] },
  { id: "done", title: "Done", taskIds: [] },
];

export default function ServiceRequestKanban() {
  const [columns, setColumns] = useState(initialColumns);
  const { implementationPlans, loading } = useGetImplementationPlans();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<ImplementationPlan | null>(null);

  console.log(implementationPlans)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = implementationPlans.find((req) => req.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = columns.find((col) => col.taskIds.includes(activeId));
    const targetColumn = columns.find(
      (col) => col.id === overId || col.taskIds.includes(overId)
    );

    if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id)
      return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            taskIds: col.taskIds.filter((id) => id !== activeId),
          };
        }
        if (col.id === targetColumn.id) {
          return {
            ...col,
            taskIds: [...col.taskIds, activeId],
          };
        }
        return col;
      })
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = columns.find((col) => col.taskIds.includes(activeId));
    const targetColumn = columns.find(
      (col) => col.id === overId || col.taskIds.includes(overId)
    );

    if (!sourceColumn || !targetColumn) return;

    // try {
    //   const targetColumnId = targetColumn.id;

    //   const response = await fetch(`/api/kanban-board/${activeId}`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ status: targetColumnId }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to update status");
    //   }
    // } catch (error) {
    //   console.error("Failed to update status:", error);

    //   setColumns((prev) =>
    //     prev.map((col) => {
    //       if (col.id === targetColumn.id) {
    //         return {
    //           ...col,
    //           taskIds: col.taskIds.filter((id) => id !== activeId),
    //         };
    //       }
    //       if (col.id === sourceColumn.id) {
    //         return {
    //           ...col,
    //           taskIds: [...col.taskIds, activeId],
    //         };
    //       }
    //       return col;
    //     })
    //   );
    // } finally {
    //   setActiveId(null);
    //   setActiveTask(null);
    // }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={implementationPlans.map((req) => req.status)}>
          <div className="flex space-x-6 overflow-x-auto p-4">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={implementationPlans.filter((req) => req.status === column.id)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
