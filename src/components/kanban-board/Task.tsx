import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskProps = {
  task: {
    id: string;
    requesterName: string;
    user: {
      department: string;
    };
    concern: string;
    details: string;
    status?: string;
  };
  isDragging?: boolean;
};

export default function Task({ task, isDragging }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 mb-2 rounded shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="font-semibold">{task.concern}</div>
      <div className="text-sm text-gray-600 mt-1">{task.details}</div>
      <div className="text-xs text-gray-500 mt-2">
        <div>Requester: {task.requesterName}</div>
        <div>Department: {task.user.department} </div>
      </div>
    </div>
  );
}
