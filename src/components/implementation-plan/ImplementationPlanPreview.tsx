import React from "react";
import EditImplementationPlan from "./EditImplementationPlanMyk";
interface ImplementationPlanPreviewProps {
  plan: ImplementationPlan;
  userRole: UserRole
  onUpdate: () => Promise<void>
}

const ImplementationPlanPreview: React.FC<ImplementationPlanPreviewProps> = ({ plan, userRole, onUpdate }) => {
  const tasksInitial = plan.tasks.map((t) => ({
    id: t.id,
    name: t.name,
    startTime: new Date(t.startTime),
    endTime: new Date(t.endTime),
    checked: t.checked,
    isEditing: false,
  }));

  const sr = plan.serviceRequest;

  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((task) => task.checked).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <EditImplementationPlan onUpdate={onUpdate} userRole={userRole} serviceRequest={sr} tasksInitial={tasksInitial} progress={progress} plan={plan}/>
  );
};



export default ImplementationPlanPreview;
