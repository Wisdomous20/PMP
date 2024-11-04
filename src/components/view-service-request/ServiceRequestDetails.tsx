'use client'

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, CheckIcon, XIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface ServiceRequestDetailsProps {
  requestorName: string;
  title: string;
  details: string;
  createdOn: string;
}

export default function ServiceRequestDetails({
  requestorName,
  title,
  details,
  createdOn
}: ServiceRequestDetailsProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reason, setReason] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattedDate = new Date(createdOn).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const handleReject = () => {
    console.log("Request rejected with reason:", rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  const handleApprove = () => {
    console.log("Request approved");
    setIsApproveDialogOpen(false);
  };

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setReason(event.target.value)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      setRows(textareaRef.current.rows)
    }
  }, [reason])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    console.log(e)
  }

  return (
    <Card className="w-full h-screen flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <Link href={"/service-request"}>
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="flex space-x-2">
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
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={requestorName} />
              <AvatarFallback>{requestorName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{requestorName}</span>
            <span>&lt;{requestorName.toLowerCase().replace(' ', '.')}@example.com&gt;</span>
          </div>
          <time dateTime={createdOn}>{formattedDate}</time>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 flex-grow">
        <div className="prose max-w-none">
          <p>{details}</p>
        </div>
      </CardContent>
      <Separator className="my-4" />
      <div className="px-6 pb-4 flex justify-between">
        <Button variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}