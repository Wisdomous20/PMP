'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";

export default function ApproveServiceRequest() {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const handleApprove = () => {
    console.log("Request approved");
    setIsApproveDialogOpen(false);
  };

  return(
    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        <CheckIcon className="h-4 w-4 mr-2" />
        Approve
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Approve Service Request</DialogTitle>
        <DialogDescription>
          Are you sure you want to approve this service request?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit" onClick={handleApprove}>Confirm Approval</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}