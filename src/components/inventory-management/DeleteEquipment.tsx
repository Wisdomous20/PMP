"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { fetchDeleteEquipmentById } from "@/domains/inventory-management/services/fetchDeleteEquipmentById";
import { Trash2 } from "lucide-react";

interface DeleteEquipmentDialogProps {
  equipmentId: string;
  description: string;
  onDelete: () => void;
}

export function DeleteEquipment({
  equipmentId,
  description,
  onDelete,
}: DeleteEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await fetchDeleteEquipmentById(equipmentId);
      onDelete();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting equipment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-white transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </DialogTrigger>

  
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Delete Equipment</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 break-all">
            Are you sure you want to delete{" "}
            <span className="text-gray-600 font-semibold break-all"> '{description}' </span>? <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
