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
import refreshPage from "@/utils/refreshPage";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
interface ApproveServiceRequestProps {
  serviceRequestId: string;
}

export default function ApproveServiceRequest({ serviceRequestId }: ApproveServiceRequestProps) {
  const { userRole, loading } = useGetUserRole()
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSupervisorList, setIsLoadingSupervisorList] = useState(false);

  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        setIsLoadingSupervisorList(true);
        const fetchedSupervisors = await fetchGetSupervisors();
        if (fetchedSupervisors) {
          setSupervisors(fetchedSupervisors);
        } else {
          throw Error;
        }
      } catch (error) {
        console.error("Failed to load supervisors:", error);
      } finally {
        setIsLoadingSupervisorList(false);
      }
    };

    loadSupervisors();
  }, []);

  async function handleApprove() {
    if (selectedSupervisor) {
      console.log("Request approved for supervisor:", selectedSupervisor, "with note:", note);

      try {
        setIsLoading(true);

        await fetchAssignSupervisor(serviceRequestId, selectedSupervisor.id);
        await fetchAddApprovedStatus(serviceRequestId, note);

        setIsApproveDialogOpen(false);
        setSelectedSupervisor(null);
        setNote("");

        refreshPage();
      } catch (error) {
        console.error("Failed to approve service request:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  if (loading) {
    return null; 
  }

  if (userRole !== "ADMIN") {
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

        {isLoadingSupervisorList ? (
          <div className="flex justify-center items-center h-10 w-full rounded-md bg-primary/10 animate-pulse text-primary font-medium">
            Loading Supervisors...
          </div>
        ) : (
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
        )}

        <div>
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
          <Button type="button" onClick={handleApprove} disabled={!selectedSupervisor || isLoading}>
            {isLoading ? "Approving..." : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
