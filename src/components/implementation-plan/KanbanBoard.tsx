/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, {
  useState,
  useEffect,
  useOptimistic,
  startTransition,
  useCallback,
  useRef,
} from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Column from "./Column";
import Task from "./Task";
import useGetImplementationPlans from "@/domains/implementation-plan/hooks/useGetImplementationPlans";
import { Skeleton } from "../ui/skeleton";
import fetchUpdateImplementationPlanStatus from "@/domains/implementation-plan/services/fetchUpdateImplementationPlanStatus";

type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

const initialColumns: ColumnType[] = [
  { id: "pending", title: "Pending", taskIds: [] },
  { id: "in_progress", title: "In Progress", taskIds: [] },
  { id: "completed", title: "Completed", taskIds: [] },
];

export default function ServiceRequestKanban() {
  const { implementationPlans, loading } = useGetImplementationPlans();
  const [columns, setColumns] = useState(initialColumns);
  const [activeTask, setActiveTask] = useState<ImplementationPlan | null>(null);
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const currentOverColumn = useRef<string | null>(null);
  const isUpdatingRef = useRef(false);
  const columnHistory = useRef<string[]>([]);
  const databaseState = useRef<{ [taskId: string]: string }>({});

  useEffect(() => {
    if (implementationPlans.length > 0) {
      const newColumns = initialColumns.map((col) => ({
        ...col,
        taskIds: implementationPlans
          .filter((plan) => plan.status === col.id)
          .map((plan) => plan.id),
      }));

      const newDatabaseState: { [taskId: string]: string } = {};
      implementationPlans.forEach((plan) => {
        newDatabaseState[plan.id] = plan.status;
      });
      databaseState.current = newDatabaseState;

      setColumns(newColumns);
      startTransition(() => {
        setOptimisticColumns(newColumns);
      });
    }
  }, [implementationPlans]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    try {
      const { active } = event;
      const id = active.id.toString();

      const task = implementationPlans.find((plan) => plan.id === id);
      if (!task) return;

      setActiveTask(task);
      setIsDragging(true);
      setActiveId(id);

      currentOverColumn.current = task.status;
      isUpdatingRef.current = false;
      columnHistory.current = [task.status];
    } catch (error) {
      console.error("Error in drag start:", error);
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    try {
      const { active, over } = event;

      if (!over || !active) return;

      const activeId = active.id.toString();
      const overId = over.id.toString();

      const sourceColumn = columns.find((col) =>
        col.taskIds.includes(activeId)
      );
      if (!sourceColumn) return;

      let targetColumn = columns.find((col) => col.id === overId);
      if (!targetColumn) {
        targetColumn = columns.find((col) => col.taskIds.includes(overId));
      }

      if (!targetColumn || sourceColumn.id === targetColumn.id) return;

      if (targetColumn.id !== currentOverColumn.current) {
        currentOverColumn.current = targetColumn.id;
        columnHistory.current.push(targetColumn.id);
      }

      startTransition(() => {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === sourceColumn.id) {
              return {
                ...col,
                taskIds: col.taskIds.filter((id) => id !== activeId),
              };
            }
            if (
              col.id === targetColumn!.id &&
              !col.taskIds.includes(activeId)
            ) {
              return {
                ...col,
                taskIds: [...col.taskIds, activeId],
              };
            }

            return col;
          })
        );
      });
    } catch (error) {
      console.error("Error in drag over:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    try {
      const finalTargetColumnId = currentOverColumn.current;
      const draggedItemId = activeId;
      setIsDragging(false);
      setActiveId(null);

      if (isUpdatingRef.current || !finalTargetColumnId || !draggedItemId) {
        resetToServerState();
        isUpdatingRef.current = false;
        return;
      }

      isUpdatingRef.current = true;

      const previousState = JSON.parse(JSON.stringify(columns));

      try {
        const updatedColumns = columns.map((col) => {
          const filtered = col.taskIds.filter((id) => id !== draggedItemId);

          if (col.id === finalTargetColumnId) {
            return {
              ...col,
              taskIds: [...filtered, draggedItemId],
            };
          }

          return { ...col, taskIds: filtered };
        });

        setColumns(updatedColumns);
        startTransition(() => {
          setOptimisticColumns(updatedColumns);
        });

        const result = await fetchUpdateImplementationPlanStatus(
          draggedItemId,
          finalTargetColumnId
        );

        if (result) {
          databaseState.current[draggedItemId] = finalTargetColumnId;
        } else {
          console.error("API update failed, reverting UI");
          revertState(previousState);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        revertState(previousState);
      } finally {
        isUpdatingRef.current = false;
        currentOverColumn.current = null;
      }
    } catch (error) {
      console.error("Error in drag end:", error);
      resetToServerState();
      isUpdatingRef.current = false;
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveId(null);
    currentOverColumn.current = null;
    isUpdatingRef.current = false;
    resetToServerState();
  };

  const resetToServerState = useCallback(() => {
    const serverState = initialColumns.map((col) => ({
      ...col,
      taskIds: implementationPlans
        .filter((plan) => plan.status === col.id)
        .map((plan) => plan.id),
    }));

    setColumns(serverState);
    startTransition(() => {
      setOptimisticColumns(serverState);
    });
  }, [implementationPlans]);

  const revertState = useCallback((previousState: ColumnType[]) => {
    setColumns(previousState);
    startTransition(() => {
      setOptimisticColumns(previousState);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full p-20 flex justify-center">
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
        <Skeleton className="w-1/4 h-full mx-12"> </Skeleton>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Service Requests</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={optimisticColumns.map((col) => col.id)}>
          <div className="flex justify-evenly space-x-8 overflow-x-auto p-4 min-w-full">
            {optimisticColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={implementationPlans.filter((req) =>
                  column.taskIds.includes(req.id)
                )}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeTask && <Task task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
