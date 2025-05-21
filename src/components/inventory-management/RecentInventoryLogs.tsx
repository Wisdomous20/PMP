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
          <div>
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
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Latest Equipment Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {equipment.map((equipment) => (
            <li key={equipment.id} className="border pt-4 pl-6 pb-6">
              <div className="font-medium text-md pb-1">{equipment.description}</div>
              <div className="text-sm text-gray-600">
                Brand: {equipment.brand} | Department: {equipment.department}
              </div>
              <div className="text-sm text-gray-500">
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
