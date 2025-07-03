'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import fetchGetSupervisors from "@/domains/user-management/services/fetchGetSupervisors";
import { approveServiceRequest } from "@/lib/service-request/approve-service-request";
import refreshPage from "@/utils/refreshPage";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";

interface ApproveServiceRequestProps {
  serviceRequestId: string;
}

type Supervisor = { id: string; firstName: string; lastName: string };

export default function ApproveServiceRequest({ serviceRequestId }: ApproveServiceRequestProps) {
  const { userRole, loading } = useGetUserRole();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSupervisorList, setIsLoadingSupervisorList] = useState(false);

  useEffect(() => {
    async function loadSupervisors() {
      try {
        setIsLoadingSupervisorList(true);
        const fetched = await fetchGetSupervisors();
        setSupervisors(fetched || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSupervisorList(false);
      }
    }
    loadSupervisors();
  }, []);

  async function handleApprove() {
    if (!selectedSupervisor) return;
    setIsLoading(true);
    try {
      await approveServiceRequest(
        serviceRequestId,
        selectedSupervisor.id,
        note
      );

      setIsApproveDialogOpen(false);
      setSelectedSupervisor(null);
      setNote("");
      refreshPage();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  if (loading || userRole !== "ADMIN") return null;

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
          <DialogDescription>Confirm approval and assign a supervisor.</DialogDescription>
        </DialogHeader>

        {isLoadingSupervisorList ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : (
          <Select
            value={selectedSupervisor?.id}
            onValueChange={(val) => {
              const sup = supervisors.find((s) => s.id === val) || null;
              setSelectedSupervisor(sup);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Supervisor" />
            </SelectTrigger>
            <SelectContent>
              {supervisors.map((sup) => (
                <SelectItem key={sup.id} value={sup.id} className="hover:cursor-pointer border border-transparent hover:border-gray-800">
                  {sup.firstName} {sup.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="mt-4">
          <label htmlFor="note" className="block font-medium">
            Note (Optional)
          </label>
          <Textarea
            id="note"
            rows={3}
            placeholder="Add extra information..."
            value={note}
            maxLength={2000}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 w-full"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleApprove} disabled={!selectedSupervisor || isLoading}>
            {isLoading ? "Approving..." : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
