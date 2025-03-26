"use client"
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardStats } from "@/domains/dashboard/services/fetchDashboardStats";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalPlans: 0,
    completedPlans: 0,
    inProgressPlans: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPlans}</div>
          <p className="text-xs text-muted-foreground">+2 from last week</p>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div className="h-1 rounded-full bg-blue-600 w-[75%]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedPlans}</div>
          <p className="text-xs text-muted-foreground">+4 from last week</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-green-500" />
            <div className="text-xs text-muted-foreground">50% completion rate</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgressPlans}</div>
          <p className="text-xs text-muted-foreground">-1 from last week</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-amber-500" />
            <div className="text-xs text-muted-foreground">25% of total plans</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-blue-500" />
            <div className="text-xs text-muted-foreground">Requires attention</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
