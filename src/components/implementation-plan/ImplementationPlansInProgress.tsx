"use client"

import { useEffect, useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const implementationPlans = [
  {
    id: 1,
    concern: "System Upgrade",
    details: "Upgrade core infrastructure to latest version",
    tasks: 7,
    progress: 75,
  },
  {
    id: 2,
    concern: "Security Audit",
    details: "Perform quarterly security assessment",
    tasks: 7,
    progress: 79,
  },
  {
    id: 3,
    concern: "Data Migration",
    details: "Transfer data to new storage solution",
    tasks: 7,
    progress: 74,
  },
  {
    id: 4,
    concern: "UI Redesign",
    details: "Implement new design system across platform",
    tasks: 7,
    progress: 78,
  },
  {
    id: 5,
    concern: "API Integration",
    details: "Connect with third-party service providers",
    tasks: 7,
    progress: 76,
  },
  {
    id: 6,
    concern: "Performance Optimization",
    details: "Improve system response time and efficiency",
    tasks: 7,
    progress: 74,
  },
]

export default function ImplementationPlans() {
  const [loading, setLoading] = useState(true)

  // Simulate a network delay for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Implementation Plans in Progress
        </CardTitle>
        <Button variant="ghost" className="text-blue-600 font-medium text-sm">
          See more
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {implementationPlans.map((plan) => (
            <Card key={plan.id} className="border border-gray-100 shadow-none">
              <CardHeader className="flex items-start justify-between p-3 pb-0">
                <div>
                  <h3 className="font-medium text-gray-700">{plan.concern}</h3>
                  <p className="text-xs text-gray-500">{plan.details}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit plan</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <div className="text-xs text-gray-500 mb-1.5">
                  {plan.tasks} Tasks | {plan.progress}%
                </div>
                <Progress value={plan.progress} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
