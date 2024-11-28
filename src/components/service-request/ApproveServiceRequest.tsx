'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import fetchGetSupervisors from "@/domains/user-management/services/fetchGetSupervisors";

export default function ApproveServiceRequest() {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  useEffect(() => {
    const loadSupervisors = async () => {
      const fetchedSupervisors = await fetchGetSupervisors();
      if (fetchedSupervisors) {
        setSupervisors(fetchedSupervisors);
      }
    };

    loadSupervisors();
  }, []);

  const handleApprove = () => {
    console.log("Request approved for supervisor:", selectedSupervisor);
    setIsApproveDialogOpen(false);
    setSelectedSupervisor("");
  };

  return (
    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-400 hover:text-white">
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

        <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
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

        <DialogFooter>
          <Button type="button" onClick={handleApprove} disabled={!selectedSupervisor}>
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
