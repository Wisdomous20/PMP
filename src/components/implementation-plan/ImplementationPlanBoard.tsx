"use client"
import React from "react";
import ImplementationPlanPreview from "./ImplementationPlanPreview";
import ImplementationPlansHeader from "./ImplementationPlansHeader";
import useGetImplementationPlans from "@/domains/implementation-plan/hooks/useGetImplementationPlans";

const ImplementationPlansBoard: React.FC = () => {
  const { implementationPlans, loading, error } = useGetImplementationPlans();

  const categorizePlan = (plan: ImplementationPlan) => {
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter(task => task.checked).length;
    if (completedTasks === 0) return "pending";
    if (completedTasks < totalTasks) return "in_progress";
    return "done";
  };

  const pendingPlans = implementationPlans.filter(plan => categorizePlan(plan) === "pending");
  const inProgressPlans = implementationPlans.filter(plan => categorizePlan(plan) === "in_progress");
  const donePlans = implementationPlans.filter(plan => categorizePlan(plan) === "done");
  console.log(implementationPlans)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 w-full">
      <ImplementationPlansHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Pending Column */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
              <h2 className="font-medium text-gray-800">Pending</h2>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              {pendingPlans.length}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 min-h-[500px]">
            {pendingPlans.map(plan => (
              <ImplementationPlanPreview key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
        {/* In Progress Column */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <h2 className="font-medium text-gray-800">In Progress</h2>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              {inProgressPlans.length}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-blue-50 p-3 min-h-[500px]">
            {inProgressPlans.map(plan => (
              <ImplementationPlanPreview key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
        {/* Done Column */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <h2 className="font-medium text-gray-800">Done</h2>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              {donePlans.length}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-green-50 p-3 min-h-[500px]">
            {donePlans.map(plan => (
              <ImplementationPlanPreview key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationPlansBoard;
