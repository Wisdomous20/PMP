'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RequesterDetails from '../implementation-plan/ImplementationPlanRequesterDetails'
import TaskList from '../implementation-plan/ImplementationPlanTaskList'
import FileUpload from '../implementation-plan/ImplementationPlanFileUpload'
import AdditionalDetails from '../implementation-plan/ImplementationPlanAdditionalDetails'

export default function ImplementationPlanForm() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Implementation Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <RequesterDetails />
            <TaskList />
          </div>
          <div className="space-y-4">
            <FileUpload />
            <AdditionalDetails />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
