"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import { rejectServiceRequest } from "@/lib/service-request/reject-service-request";
import refreshPage from "@/utils/refreshPage";
import {useSession} from "next-auth/react";

interface RejectServiceRequestProps {
  serviceRequestId: string;
}

export default function RejectServiceRequest({ serviceRequestId }: RejectServiceRequestProps) {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.data) {
      setRole(session.data.user.role);
    }
  }, [session]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [note]);

  const handleSubmit = async () => {
    if (!note.trim()) {
      setError("Reason is required.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await rejectServiceRequest(serviceRequestId, note);
      setIsOpen(false);
      setNote("");
      refreshPage();
    } catch (e) {
      setError("Failed to reject the request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (role !== "ADMIN") {
    return <></>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-300">
          <XIcon className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Service Request</DialogTitle>
          <DialogDescription>Provide a reason for rejection.</DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="mt-4">
          <Label htmlFor="note">Reason</Label>
          <Textarea
            id="note"
            ref={textareaRef}
            value={note}
            maxLength={2000}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type reason..."
            rows={1}
            className="mt-2 w-full resize-none max-h-[200px]"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}