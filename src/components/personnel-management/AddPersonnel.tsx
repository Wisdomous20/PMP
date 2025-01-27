'use client';
import { useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";

interface AddPersonnelProps {
  onAdd: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

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
      onOpenChange(false); // Close the dialog after adding personnel
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>Please fill in the details below:</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPersonnel}>
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
            <Button type="submit">Add New</Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
