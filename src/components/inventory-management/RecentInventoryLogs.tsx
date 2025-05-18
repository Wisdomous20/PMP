"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentInventoryLogsProps {
  isLoading: boolean,
  equipment: Equipment[],
  error: string | null
}

export default function RecentInventoryLogs({isLoading, equipment, error} : RecentInventoryLogsProps) {

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Latest Equipment Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Latest Equipment Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-red-500">
          Error: {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Latest Equipment Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="space-y-3">
          {equipment.map((equipment) => (
            <li key={equipment.id} className="border p-3 rounded-md">
              <div className="font-medium text-sm">{equipment.description}</div>
              <div className="text-xs text-gray-600">
                Brand: {equipment.brand} | Department: {equipment.department}
              </div>
              <div className="text-xs text-gray-500">
                Quantity: {equipment.quantity} | Purchased:{" "}
                {new Date(equipment.datePurchased).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
