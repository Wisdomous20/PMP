// components/ImplementationPlanPreview.tsx
import React from "react";
import EditImplementationPlan from "./EditImplementationPlanMyk";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
interface ImplementationPlanPreviewProps {
  plan: ImplementationPlan;
}

const ImplementationPlanPreview: React.FC<ImplementationPlanPreviewProps> = ({ plan }) => {
  const { userRole, loading, error } = useGetUserRole();
  const isSecretary = userRole === "SECRETARY";

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
    <Card key={plan.id} className="border border-gray-100 shadow-none">
      <CardHeader className="flex items-start justify-between p-3 pb-0">
        <div>
          <h3 className="font-medium text-gray-700 truncate">{sr?.concern || "No Concern"}</h3>
          <p className="text-xs text-gray-500 truncate">{sr?.details || "No Details"}</p>
        </div>
        {!isSecretary && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditImplementationPlan serviceRequest={sr} tasksInitial={tasksInitial} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="text-xs text-gray-500 mb-1.5 flex justify-between">
          <span>{plan.tasks.length} Tasks</span>
          <span>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-1.5"
        />
      </CardContent>
    </Card>
  );
};



export default ImplementationPlanPreview;
