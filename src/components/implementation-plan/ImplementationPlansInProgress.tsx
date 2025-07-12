"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ImplementationPlanPreview from "./ImplementationPlanPreview";
import Link from "next/link";

const isInProgress = (plan: ImplementationPlan) => {
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((task) => task.checked).length;
  return completedTasks > 0 && completedTasks < totalTasks;
};

interface ImplementationPlansInProgressProps {
  isLoading: boolean
  implementationPlans: ImplementationPlan[],
  error: string | null
  userRole: UserRole;
  onUpdateAction: () => Promise<void>
}

export default function ImplementationPlansInProgress({ isLoading, implementationPlans, error, userRole, onUpdateAction }: ImplementationPlansInProgressProps) {
  const inProgressPlans = isLoading ? [] : implementationPlans.filter(isInProgress);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border border-gray-100 shadow-none">
                <CardHeader className="flex items-start justify-between p-3 pb-0">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-7 w-7" />
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Implementation Plans in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-sm text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Implementation Plans in Progress
        </CardTitle>
        <Link href="/projects">
          <Button variant="ghost" className="text-blue-600 font-medium text-sm">
            See more
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        {inProgressPlans.length === 0 ? (
          <div className="text-sm text-gray-500">No in-progress plans available.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressPlans.map((plan) => (
              <ImplementationPlanPreview key={plan.id} plan={plan} userRole={userRole} onUpdate={onUpdateAction}/>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
