'use client';
import { useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import updatePersonnelService from "../../domains/manpower-management/service/updatePersonnel";

interface UpdatePersonnelProps {
  onUpdate: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPersonnel: { id: string; name: string; department: string; position: string } | null;
}

export default function UpdatePersonnel({ onUpdate, isOpen, onOpenChange, currentPersonnel }: UpdatePersonnelProps) {
  const [name, setName] = useState(currentPersonnel ? currentPersonnel.name : "");
  const [department, setDepartment] = useState(currentPersonnel ? currentPersonnel.department : "");
  const [position, setPosition] = useState(currentPersonnel ? currentPersonnel.position : "");

  const handleUpdatePersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentPersonnel) {
      const response = await updatePersonnelService(currentPersonnel.id, name, department, position);
      if (response) {
        onUpdate();
        onOpenChange(false); // Close the dialog after updating personnel
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Personnel</DialogTitle>
          <DialogDescription>Please update the details below:</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdatePersonnel}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="mb-2"
          />
          <Input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
            className="mb-2"
          />
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
            className="mb-2"
          />
          <DialogFooter>
            <Button type="submit">Update</Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
