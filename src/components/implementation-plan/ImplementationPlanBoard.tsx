"use client";
import React from "react";
import ImplementationPlanPreview from "./ImplementationPlanPreview";
import ImplementationPlansHeader from "./ImplementationPlansHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserRole } from "@/domains/user-management/services/fetchUserRole";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import fetchGetImplementationPlans from "@/domains/implementation-plan/services/fetchGetImplementationPlans";

const ImplementationPlansBoard: React.FC = () => {
  const { data: session } = useSession();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", session?.user.id],
    queryFn: () => fetchUserRole(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const { data: implementationPlans, isLoading: loading, error } = useQuery({
    queryKey: ["ImplementationPlans", session?.user.id],
    queryFn: () => fetchGetImplementationPlans(session?.user.id as string),
    enabled: !!session?.user.id,
  });

  const categorizePlan = (plan: ImplementationPlan) => {
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    if (completedTasks === 0) return "pending";
    if (completedTasks < totalTasks) return "in_progress";
    return "done";
  };

  const pendingPlans = implementationPlans ? implementationPlans.filter(
    (plan) => categorizePlan(plan) === "pending"
  ) : []
  const inProgressPlans = implementationPlans ? implementationPlans.filter(
    (plan) => categorizePlan(plan) === "in_progress"
  ) : []
  const donePlans = implementationPlans ? implementationPlans.filter(
    (plan) => categorizePlan(plan) === "done"
  ) : []

  if (loading || isLoading) {
    return (
      <div className="p-4 w-full">
        <ImplementationPlansHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {["Pending", "In Progress", "Done"].map((status, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 min-h-[500px]">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

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
            {pendingPlans.map((plan) => (
              <ImplementationPlanPreview key={plan.id} plan={plan} userRole={userRole as UserRole} />
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
            {inProgressPlans.map((plan) => (
              <ImplementationPlanPreview key={plan.id} plan={plan} userRole={userRole as UserRole} />
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
            {donePlans.map((plan) => (
              <ImplementationPlanPreview key={plan.id} plan={plan} userRole={userRole as UserRole} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationPlansBoard;
