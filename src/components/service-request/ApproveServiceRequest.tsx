"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getSupervisors } from "@/lib/supervisor/get-supervisors";
import { approveServiceRequest } from "@/lib/service-request/approve-service-request";
import refreshPage from "@/utils/refreshPage";
import { useSession } from "next-auth/react";

interface ApproveServiceRequestProps {
  serviceRequestId: string;
}

type Supervisor = { id: string; firstName: string; lastName: string };

export default function ApproveServiceRequest({ serviceRequestId }: ApproveServiceRequestProps) {
  const session = useSession();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSupervisorList, setIsLoadingSupervisorList] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.data) {
      if (session.data.user.role === "ADMIN") {
        setRole(session.data.user.role);
      }
    }
  }, [session]);

  useEffect(() => {
    async function loadSupervisors() {
      try {
        setIsLoadingSupervisorList(true);
        setIsLoading(true);

        const fetched = await getSupervisors();
        setSupervisors(fetched || []);
      } catch {
        // Do nothing
      } finally {
        setIsLoadingSupervisorList(false);
        setIsLoading(false);
      }
    }
    loadSupervisors().catch(console.error);
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

  if (role !== "ADMIN") {
    return <></>
  }

  return (
    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-indigo-700 hover:bg-indigo-400/90">
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
