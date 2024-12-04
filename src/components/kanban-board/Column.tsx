import React from "react";
import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type ColumnProps = {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  tasks: {
    id: string;
    requesterName: string;
    user: {
      department: string;
    };
    concern: string;
    details: string;
    status: string;
  }[];
};

export default function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-gray-100 p-4 rounded-lg shadow-md w-80
        h-[600px] flex flex-col
        ${isOver ? "bg-gray-200 ring-2 ring-blue-400" : ""}
      `}
    >
      <h2 className="font-bold mb-4 sticky top-0 bg-gray-100 z-10">
        {column.title}
      </h2>
      <div className="flex-1 overflow-y-auto">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length > 0 ? (
            <div className="space-y-3 min-h-full">
              {/* Drop indicator when hovering at the top */}
              {isOver && (
                <div className="h-2 bg-blue-200 rounded mb-2 transition-all" />
              )}
              {tasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-500">
              No tasks
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
