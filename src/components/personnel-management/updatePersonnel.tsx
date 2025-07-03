'use client';
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../ui/dialog";
import { updatePersonnel } from "@/lib/personnel/update-personnel";

interface UpdatePersonnelProps {
  onUpdate: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPersonnel: { id: string; name: string; department: string; position: string } | null;
}

const MAX_LENGTH = {
  name: 255,
  department: 128,
  position: 128
};

export default function UpdatePersonnel({ onUpdate, isOpen, onOpenChange, currentPersonnel }: UpdatePersonnelProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (currentPersonnel) {
      setName(currentPersonnel.name);
      setDepartment(currentPersonnel.department);
      setPosition(currentPersonnel.position);
    }
  }, [currentPersonnel]);

  const handleUpdatePersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentPersonnel) {
      const response = await updatePersonnel(
        currentPersonnel.id,
        name,
        department,
        position
      );
      if (response) {
        onUpdate();
        onOpenChange(false);
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
        <form onSubmit={handleUpdatePersonnel} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              maxLength={MAX_LENGTH.name}
              className="mb-1"
            />
            <p className="text-xs text-gray-500">{name.length}/{MAX_LENGTH.name}</p>
          </div>
          <div>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              maxLength={MAX_LENGTH.department}
              className="mb-1"
            />
            <p className="text-xs text-gray-500">{department.length}/{MAX_LENGTH.department}</p>
          </div>
          <div>
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              maxLength={MAX_LENGTH.position}
              className="mb-1"
            />
            <p className="text-xs text-gray-500">{position.length}/{MAX_LENGTH.position}</p>
          </div>
          <DialogFooter>
            <Button
             type="submit"
             className="bg-indigo-Background hover:bg-indigo-900"
            >Update
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
