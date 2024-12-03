'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function RequesterDetails() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Name of requester</Label>
          <Input id="name" />
        </div>
        <div>
          <Label htmlFor="date">Request Date</Label>
          <Input id="date" type="date" />
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title of Request</Label>
        <Input id="title" />
      </div>
      <div>
        <Label htmlFor="details">Details of the Request</Label>
        <Textarea id="details" className="min-h-[100px]" />
      </div>
    </>
  )
}
