'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import fetchGetSupervisors from "@/domains/user-management/services/fetchGetSupervisors";
import fetchAssignSupervisor from "@/domains/service-request/services/fetchAssignSupervisor";
import { fetchAddApprovedStatus } from "@/domains/service-request/services/status/fetchAddSatus";

interface ApproveServiceRequestProps {
  serviceRequestId: string;
}

export default function ApproveServiceRequest({ serviceRequestId }: ApproveServiceRequestProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        const fetchedSupervisors = await fetchGetSupervisors();
        if (fetchedSupervisors) {
          setSupervisors(fetchedSupervisors);
        }
      } catch (error) {
        console.error("Failed to load supervisors:", error);
      }
    };

    loadSupervisors();
  }, []);

  async function handleApprove() {
    if (selectedSupervisor) {
      console.log("Request approved for supervisor:", selectedSupervisor, "with note:", note);

      try {
        await fetchAssignSupervisor(serviceRequestId, selectedSupervisor.id);
        await fetchAddApprovedStatus(serviceRequestId, note);

        setIsApproveDialogOpen(false);
        setSelectedSupervisor(null);
        setNote("");
      } catch (error) {
        console.error("Failed to approve service request:", error);
      }
    }
  }

  return (
    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-indigo-Background hover:bg-indigo-Background/90">
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

        <Select
          value={selectedSupervisor?.id}
          onValueChange={(value) => {
            const supervisor = supervisors.find((sup) => sup.id === value);
            setSelectedSupervisor(supervisor || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Supervisor" />
          </SelectTrigger>

          <SelectContent>
            {supervisors.map((supervisor) => (
              <SelectItem key={supervisor.id} value={supervisor.id}>
                {supervisor.firstName} {supervisor.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <label htmlFor="note" className="block font-medium">
            Note (Optional)
          </label>
          <Textarea
            id="note"
            placeholder="Add any extra information..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full resize-none"
          />
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleApprove} disabled={!selectedSupervisor}>
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
