'use client';
import { useState } from "react";
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

interface AddPersonnelProps {
  onAdd: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MAX_LENGTH = {
  name: 255,
  department: 128,
  position: 128
};

export default function AddPersonnel({ onAdd, isOpen, onOpenChange }: AddPersonnelProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const handleAddPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/manpower-management", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, department, position }),
    });
    if (response.ok) {
      onAdd();
      setName("");
      setDepartment("");
      setPosition("");
      onOpenChange(false);
    }
  };

  const isFormValid = name.trim() && department.trim() && position.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>Please fill in the details below:</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPersonnel} className="space-y-4">
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
            <Button type="submit" disabled={!isFormValid}>Add New</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
