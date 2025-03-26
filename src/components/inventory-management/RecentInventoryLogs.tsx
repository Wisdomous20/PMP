"use client"

import { useState, useEffect } from "react"
import fetchPaginatedEquipment from "@/domains/inventory-management/services/fetchPaginatedEquipment"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecentInventoryLogs() {
  const [equipmentLogs, setEquipmentLogs] = useState<Equipment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response: PaginatedResponse<Equipment> = await fetchPaginatedEquipment({
          page: 1,
          pageSize: 15,
        })
        setEquipmentLogs(response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching equipment logs:", err)
        setError(err.message || "Error fetching equipment logs")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
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
      <CardContent>
        <ul className="space-y-3">
          {equipmentLogs.map((equipment) => (
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
