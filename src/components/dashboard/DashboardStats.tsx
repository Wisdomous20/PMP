"use client";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Package,
  BarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface DashboardStatsProps {
  isLoading: boolean;
  stats: Stats;
  error: string | null;
}

export default function DashboardStats({
  isLoading,
  stats,
  error,
}: DashboardStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-4 w-24" />
              <div className="mt-4">
                <Skeleton className="h-1 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Dashboard Statistics
          </CardTitle>
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 text-red-500">
          <div className="flex items-center space-x-2">
            <p>Error loading statistics: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      title: "Total Plans",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      value: stats.totalPlans,
      delta: stats.totalPlansDelta,
      percentage: null,
    },
    {
      title: "Completed",
      icon: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />,
      value: stats.completedPlans,
      delta: stats.completedPlansDelta,
      percentage: `${stats.completionRate}% completion rate`,
    },
    {
      title: "In Progress",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      value: stats.inProgressPlans,
      delta: stats.inProgressPlansDelta,
      percentage: `${stats.inProgressPercentage}% of total plans`,
    },
    {
      title: "Pending Requests",
      icon: (
        <Link href="/service-request">
          <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
        </Link>
      ),
      value: stats.pendingRequests,
      delta: stats.pendingRequestsDelta,
      percentage: "Requires attention",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
  {item.icon}
</CardHeader>
<CardContent>
  <div className="flex flex-col h-full">
    <div className="text-2xl font-bold mb-4">{item.value}</div>
    <div className="flex flex-1" />
<div className="flex flex-col items-start gap-1">
  <span
    className={`flex items-center text-xs ${
      item.title === "Completed"
        ? "text-green-600"
        : item.title === "In Progress"
        ? "text-amber-600"
        : item.title === "Pending Requests"
        ? "text-blue-600"
        : "text-indigo-900"
    }`}
  >
    {item.delta >= 0 ? (
      <>
        <span className="inline-flex items-center justify-center w-2 h-2 font-bold text-base leading-none">
          +
        </span>
        <span className="ml-2">{item.delta} from last week</span>
      </>
    ) : (
      `${item.delta} from last week`
    )}
  </span>
  {item.percentage && (
    <span className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full inline-block align-middle ${
          item.title === "Completed"
            ? "bg-green-500"
            : item.title === "In Progress"
            ? "bg-amber-500"
            : "bg-blue-500"
        }`}
      />
      <span className="text-xs text-muted-foreground">
        {item.percentage}
      </span>
    </span>
  )}
</div>
  </div>
</CardContent>
        </Card>
      ))}
    </div>
  );
}
