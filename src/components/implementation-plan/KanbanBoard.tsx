/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
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
import { Skeleton } from "../ui/skeleton";

type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

const initialColumns: ColumnType[] = [
  { id: "pending", title: "Pending", taskIds: [] },
  { id: "ongoing", title: "Ongoing", taskIds: [] },
  { id: "completed", title: "Completed", taskIds: [] },
];

export default function ServiceRequestKanban() {
  const { implementationPlans, loading } = useGetImplementationPlans();
  const [columns, setColumns] = useState(initialColumns);
  const [activeTask, setActiveTask] = useState<ImplementationPlan | null>(null);

  useEffect(() => {
    if (implementationPlans.length > 0) {
      setColumns(
        initialColumns.map((col) => ({
          ...col,
          taskIds: implementationPlans
            .filter((plan) => plan.status === col.id)
            .map((plan) => plan.id),
        }))
      );
    }
  }, [implementationPlans]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = String(active.id);
    const overId = String(over.id);
  
    // Find source and target columns
    const sourceColumn = columns.find((col) => col.taskIds.includes(activeId));
    const targetColumn = columns.find((col) => col.taskIds.includes(overId) || col.id === overId);
  
    if (!sourceColumn || !targetColumn) return;
  
    if (sourceColumn.id === targetColumn.id) {
      const reorderedTaskIds = [...sourceColumn.taskIds];
      const oldIndex = reorderedTaskIds.indexOf(activeId);
      const newIndex = reorderedTaskIds.indexOf(overId);
  
      reorderedTaskIds.splice(oldIndex, 1);
      reorderedTaskIds.splice(newIndex, 0, activeId);
  
      setColumns((prev) =>
        prev.map((col) =>
          col.id === sourceColumn.id
            ? { ...col, taskIds: reorderedTaskIds }
            : col
        )
      );
    } else {
      const sourceTaskIds = sourceColumn.taskIds.filter((id) => id !== activeId);
      const targetTaskIds = [...targetColumn.taskIds];
      const insertIndex = targetTaskIds.indexOf(overId);
  
      if (insertIndex === -1) {
        targetTaskIds.push(activeId);
      } else {
        targetTaskIds.splice(insertIndex, 0, activeId);
      }
  
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceColumn.id) {
            return { ...col, taskIds: sourceTaskIds };
          }
          if (col.id === targetColumn.id) {
            return { ...col, taskIds: targetTaskIds };
          }
          return col;
        })
      );
    }
  };  

  if (loading) {
    return (
      <div className="w-full h-full p-20 flex justify-center">
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
      </div>
    )
  }

  return (
    <div className="p-4 w-full max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Service Requests</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={columns.map((col) => col.id)}>
          <div className="flex justify-evenly space-x-8 overflow-x-auto p-4 min-w-full">
            {columns.map((column) => {
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={implementationPlans.filter((req) =>
                    column.taskIds.includes(req.id)
                  )}
                />
              );
            })}

          </div>
        </SortableContext>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
