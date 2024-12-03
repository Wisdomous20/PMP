'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function FileUpload() {
  return (
    <div>
      <Label htmlFor="file">Upload File</Label>
      <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
        <Input id="file" type="file" className="hidden" />
        <Label
          htmlFor="file"
          className="cursor-pointer text-sm text-muted-foreground"
        >
          Click to upload or drag and drop
        </Label>
      </div>
    </div>
  )
}
