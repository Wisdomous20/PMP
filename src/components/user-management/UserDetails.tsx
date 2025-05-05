"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User } from "@prisma/client";
import fetchUpdateUserRole from "@/domains/user-management/services/fetchUpdateUserRole";
import { Button } from "@/components/ui/button";

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

type LimitedUserRole = Exclude<UserRole, 'ADMIN' | null>;

const roles: LimitedUserRole[] = ["USER", "SUPERVISOR", "SECRETARY"];

export default function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  const [selectedRole, setSelectedRole] = useState<LimitedUserRole>((user?.user_type || "USER") as LimitedUserRole);
  const [working, setWorking] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setWorking(true);
    try {
      await fetchUpdateUserRole(user.id, selectedRole);
    } catch (e) {
      console.error(e);
    } finally {
      setWorking(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">User Type:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as LimitedUserRole)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Department:</span>
            <span>{user.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Cellphone:</span>
            <span>{user.cellphoneNumber || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Local Number:</span>
            <span>{user.localNumber || '-'}</span>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button onClick={onClose} disabled={working} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={working} variant="default">
            {working ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
