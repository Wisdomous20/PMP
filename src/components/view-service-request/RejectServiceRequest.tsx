'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";

export default function RejectServiceRequest() {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reason, setReason] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReject = () => {
    console.log("Request rejected with reason:", rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReason(event.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    console.log(e)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      setRows(textareaRef.current.rows)
    }
  }, [reason])

  return(
    <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="destructive" size="sm">
        <XIcon className="h-4 w-4 mr-2" />
        Reject
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Service Request</DialogTitle>
        <DialogDescription>
          Please provide a reason for rejecting this service request.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-4">
          <Label htmlFor="reason" className="text-left">
            Reason
          </Label>
          <Textarea
            ref={textareaRef}
            value={reason}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type Reason..."
            rows={rows}
            className="min-h-[40px] max-h-[200px] resize-none"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleReject}>Confirm Rejection</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}