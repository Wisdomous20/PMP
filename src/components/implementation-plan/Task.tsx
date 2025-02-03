import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditImplementationPlan from "./EditImplementationPlanMyk";

type TaskProps = {
  task: ImplementationPlan;
  isDragging?: boolean;
};

export default function Task({ task, isDragging }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const tasksInitial = task.tasks.map((task) => ({
    id: task.id,
    name: task.name,
    deadline: new Date(task.deadline),
    confirmed: task.checked,
    isEditing: false,
  }));

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
      {/* Title with text wrapping */}
      <div
        className="font-semibold break-words max-w-full"
        style={{
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {task.serviceRequest[0]?.concern}
      </div>

      {/* Details with text wrapping */}
      <div
        className="text-sm text-gray-600 mt-1 break-words max-w-full"
        style={{
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {task.serviceRequest[0]?.details}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <div>Requester: {task.serviceRequest[0]?.requesterName}</div>
      </div>
      <EditImplementationPlan
        serviceRequest={task.serviceRequest[0]}
        tasksInitial={tasksInitial}
      />
    </div>
  );
}
