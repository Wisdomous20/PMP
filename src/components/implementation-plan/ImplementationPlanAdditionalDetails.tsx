'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function AdditionalDetails() {
  return (
    <>
      <div>
        <Label htmlFor="people">People Assigned</Label>
        <Textarea id="people" className="min-h-[100px]" />
      </div>
      <div>
        <Label htmlFor="budget">Equipment / Budget</Label>
        <Textarea id="budget" className="min-h-[100px]" />
      </div>
      <button className="w-full bg-indigo-600 hover:bg-indigo-600 py-2 text-white rounded-md">
        Confirm
      </button>
    </>
  )
}
