import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditImplementationPlan from "./EditImplementationPlanMyk";

type TaskProps = {
  task: ImplementationPlan; // Assuming you have an ImplementationPlan type imported
  isDragging?: boolean;
};

export default function Task({ task, isDragging }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Map the tasks from the implementation plan using the updated Task type fields.
  const tasksInitial = task.tasks.map((t) => ({
    id: t.id,
    name: t.name,
    startTime: new Date(t.startTime),
    endTime: new Date(t.endTime),
    checked: t.checked,
    isEditing: false,
  }));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 mb-4 rounded shadow hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* Header: Concern */}
      <div className="mb-2">
        <h3 className="font-bold text-lg truncate">
          {task.serviceRequest[0]?.concern || "No Concern"}
        </h3>
      </div>
      {/* Details */}
      <div className="text-sm text-gray-600 mb-2 break-words">
        {task.serviceRequest[0]?.details || "No Details"}
      </div>
      {/* Requester Information */}
      <div className="text-xs text-gray-500 mb-2">
        Requester: {task.serviceRequest[0]?.requesterName || "N/A"}
      </div>
      {/* Summary of tasks count */}
      <div className="mb-2">
        <span className="text-xs font-semibold">Tasks:</span>{" "}
        {task.tasks.length}
      </div>
      {/* Edit button */}
      <div className="flex justify-end">
        <EditImplementationPlan
          serviceRequest={task.serviceRequest[0]}
          tasksInitial={tasksInitial}
        />
      </div>
    </div>
  );
}
