"use client";

import React, {useEffect, useState} from "react";
import ImplementationPlanPreview from "./ImplementationPlanPreview";
import ImplementationPlansHeader from "./ImplementationPlansHeader";
import {Skeleton} from "@/components/ui/skeleton";
import {useSession} from "next-auth/react";
import { getImplementationPlansByUserId } from "@/lib/dashboard/implementation-plans";
import {ErrorCodes} from "@/lib/ErrorCodes";

const ImplementationPlansBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planUpdate, setPlanUpdate] = useState<number>(0);
  const [plansLoading, setPlansLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  
  const [board, setBoard] = useState<ImplementationPlan[]>([]);
  
  useEffect(() => {
    setPlansLoading(true);
    
    if (session.data && session.data.user && session.data.user.id) {
      async function getImplementationPlans() {
        return await getImplementationPlansByUserId(session.data!.user.id);
      }
      
      getImplementationPlans().then(r => {
        if (r.code !== ErrorCodes.OK || !r.data) {
          setPlansLoading(false);
          setError(r.message ?? null);
          return;
        }
        
        const m: ImplementationPlan[] = r.data.map(x => ({
          id: x.id,
          description: x.description,
          status: x.status,
          serviceRequestId: x.serviceRequest.id,
          serviceRequest: {
            ...x.serviceRequest,
            requesterName: x.requesterName,
            createdOn: x.createdOn,
          },
          tasks: x.tasks,
          files: x.files,
          createdAt: x.createdAt,
        }))
        
        setBoard(m);
        setPlansLoading(false);
      });
    }
  }, [session, planUpdate]);
  
  if (board === null) {
    return (<></>);
  }

  const handlePlansUpdate = async () => {
    setPlanUpdate(l => l + 1);
  };

  const categorizePlan = (plan: ImplementationPlan) => {
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter((task) => task.checked).length;
    if (completedTasks === 0) return "pending";
    if (completedTasks < totalTasks) return "in_progress";
    return "done";
  };

  const filterPlans = (plans: ImplementationPlan[] | undefined) => {
    if (!plans) return [];
    if (!searchQuery.trim()) return plans;

    return plans.filter(
      (plan) =>
        plan.serviceRequest.concern
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        plan.serviceRequest.details
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const filteredPlans = filterPlans(board);

  const pendingPlans = filteredPlans.filter(
    (plan) => categorizePlan(plan) === "pending"
  );
  const inProgressPlans = filteredPlans.filter(
    (plan) => categorizePlan(plan) === "in_progress"
  );
  const donePlans = filteredPlans.filter(
    (plan) => categorizePlan(plan) === "done"
  );

  if (plansLoading || !session.data) {
    return (
      <div className="p-4 w-full">
        <ImplementationPlansHeader
          onSearchChange={setSearchQuery}
          loading={true}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {["Pending", "In Progress", "Done"].map((_, idx) => (
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 w-full ">
      <ImplementationPlansHeader
        onSearchChange={setSearchQuery}
        loading={plansLoading}
      />

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
          <div className="flex flex-col gap-3 rounded-lg bg-gray-100 p-3 h-[500px] overflow-y-scroll">
            {pendingPlans.map((plan) => (
              <ImplementationPlanPreview
                key={plan.id}
                plan={plan}
                userRole={session.data!.user.role as UserRole}
                onUpdate={handlePlansUpdate}
              />
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
          <div className="flex flex-col gap-3 rounded-lg bg-blue-100 p-3 min-h-[500px]">
            {inProgressPlans.map((plan) => (
              <ImplementationPlanPreview
                key={plan.id}
                plan={plan}
                userRole={session.data!.user.role as UserRole}
                onUpdate={handlePlansUpdate}
              />
            ))}
          </div>
        </div>
        {/* Done Column */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <h2 className="font-medium text-gray-800">Pending Work Evaluation</h2>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              {donePlans.length}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-green-100 p-3 h-[500px] overflow-y-scroll">
            {donePlans.map((plan) => (
              <ImplementationPlanPreview
                key={plan.id}
                plan={plan}
                userRole={session.data!.user.role as UserRole}
                onUpdate={handlePlansUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationPlansBoard;
