"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@prisma/client";

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user.firstName} {user.lastName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>User Type:</strong> {user.user_type}</div>
          <div><strong>Department:</strong> {user.department}</div>
          <div><strong>Cellphone Number:</strong> {user.cellphoneNumber}</div>
          <div><strong>Local Number:</strong> {user.localNumber}</div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
