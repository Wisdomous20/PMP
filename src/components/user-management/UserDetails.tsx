"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import fetchUpdateUser from "@/domains/user-management/services/fetchUpdateUser";
import { Button } from "@/components/ui/button";

type LimitedUserRole = Exclude<User["user_type"], "ADMIN" | null>;

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const MAX_PENDING_LIMIT = 50;
const roles: LimitedUserRole[] = ["USER", "SUPERVISOR", "SECRETARY"];

export default function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  const [selectedRole, setSelectedRole] = useState<LimitedUserRole>(
    (user?.user_type || "USER") as LimitedUserRole
  );
  const [pendingLimit, setPendingLimit] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.user_type as LimitedUserRole);
      const initial = user.pendingLimit ?? 5;
      setPendingLimit(initial);
      setError(
        initial > MAX_PENDING_LIMIT
          ? `Maximum pending limit is ${MAX_PENDING_LIMIT}`
          : ""
      );
    }
  }, [user]);

  if (!user) return null;

  const handlePendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPendingLimit(value);
    if (isNaN(value) || value < 1) {
      setError("Pending limit must be at least 1");
    } else if (value > MAX_PENDING_LIMIT) {
      setError(`Maximum pending limit is ${MAX_PENDING_LIMIT}`);
    } else {
      setError("");
    }
  };

  const handleSave = async () => {
    if (error) return;
    setWorking(true);
    try {
      await fetchUpdateUser(user.id, selectedRole, pendingLimit);
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
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="font-medium">Pending Limit:</span>
              <input
                type="number"
                min={1}
                max={MAX_PENDING_LIMIT}
                value={pendingLimit}
                onChange={handlePendingChange}
                className={`border rounded-md px-3 py-1 w-20 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Department:</span>
            <span>{user.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Cellphone:</span>
            <span>{user.cellphoneNumber || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Local Number:</span>
            <span>{user.localNumber || "-"}</span>
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button onClick={onClose} disabled={working} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={working || !!error} variant="default">
            {working ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
