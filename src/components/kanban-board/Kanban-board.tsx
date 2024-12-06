"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

type ServiceRequestType = {
  id: string;
  requesterName: string;
  user: {
    department: string;
  };
  concern: string;
  details: string;
  createdOn: Date | null;
  status: string;
};

const initialColumns: ColumnType[] = [
  { id: "pending", title: "Pending", taskIds: [] },
  { id: "approved", title: "Approved", taskIds: [] },
  { id: "in_progress", title: "In Progress", taskIds: [] },
  { id: "rejected", title: "Rejected", taskIds: [] },
];

export default function ServiceRequestKanban() {
  const [columns, setColumns] = useState(initialColumns);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestType[]>(
    []
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<ServiceRequestType | null>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchServiceRequests = async () => {
        try {
          const response = await fetch("/api/kanban-board/[id]");
          const requestsWithStatus = await response.json();

          setServiceRequests(requestsWithStatus);

          const updatedColumns = initialColumns.map((column) => ({
            ...column,
            taskIds: requestsWithStatus
              .filter(
                (req: ServiceRequestType) =>
                  req.status.toLowerCase() === column.id
              )
              .map((req: ServiceRequestType) => req.id),
          }));

          setColumns(updatedColumns);
        } catch (error) {
          console.error("Failed to fetch service requests", error);
        }
      };

      fetchServiceRequests();
    }
  }, [userId]);

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
    const task = serviceRequests.find((req) => req.id === active.id);
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

    try {
      const targetColumnId = targetColumn.id;

      const response = await fetch(`/api/kanban-board/${activeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: targetColumnId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setServiceRequests((prev) =>
        prev.map((req) =>
          req.id === activeId ? { ...req, status: targetColumnId } : req
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === targetColumn.id) {
            return {
              ...col,
              taskIds: col.taskIds.filter((id) => id !== activeId),
            };
          }
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              taskIds: [...col.taskIds, activeId],
            };
          }
          return col;
        })
      );
    } finally {
      setActiveId(null);
      setActiveTask(null);
    }
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
        <SortableContext items={serviceRequests.map((req) => req.id)}>
          <div className="flex space-x-6 overflow-x-auto p-4">
            {" "}
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={serviceRequests.filter((req) =>
                  column.taskIds.includes(req.id)
                )}
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
