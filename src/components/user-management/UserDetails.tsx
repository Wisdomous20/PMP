"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { User } from "@prisma/client"
import fetchUpdateUser from "@/domains/user-management/services/fetchUpdateUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserIcon, Mail, UserCog, ClipboardList, Building, Phone, PhoneCall, Loader2,
  // Pencil
} from "lucide-react"

type LimitedUserRole = Exclude<User["user_type"], "ADMIN" | null>

interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onClose: () => void
}

const MAX_PENDING_LIMIT = 50
const roles: LimitedUserRole[] = ["USER", "SUPERVISOR", "SECRETARY"]

export default function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  const [selectedRole, setSelectedRole] = useState<LimitedUserRole>((user?.user_type || "USER") as LimitedUserRole)
  const [pendingLimit, setPendingLimit] = useState<number>(5)
  const [error, setError] = useState<string>("")
  const [working, setWorking] = useState(false)
  const [editingRole, setEditingRole] = useState(false)

  useEffect(() => {
    if (user) {
      setSelectedRole(user.user_type as LimitedUserRole)
      const initial = user.pendingLimit ?? 5
      setPendingLimit(initial)
      setError(initial > MAX_PENDING_LIMIT ? `Maximum pending limit is ${MAX_PENDING_LIMIT}` : "")
    }
  }, [user])

  if (!user) return null

  const handlePendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    setPendingLimit(value)
    if (isNaN(value) || value < 1) {
      setError("Pending limit must be at least 1")
    } else if (value > MAX_PENDING_LIMIT) {
      setError(`Maximum pending limit is ${MAX_PENDING_LIMIT}`)
    } else {
      setError("")
    }
  }

  const handleSave = async () => {
    if (error) return
    setWorking(true)
    try {
      await fetchUpdateUser(user.id, selectedRole, pendingLimit)
    } catch (e) {
      console.error(e)
    } finally {
      setWorking(false)
      onClose()
    }
  }

  const getRoleBadgeColor = (role: LimitedUserRole) => {
    switch (role) {
      case "SUPERVISOR":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "SECRETARY":
        return "bg-purple-100 text-purple-800 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="max-w-md p-0 bg-white rounded-xl shadow-xl overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
            {user.firstName} {user.lastName}
          </DialogTitle>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedRole as LimitedUserRole)} pointer-events-none`}
            >
              {selectedRole}
            </span>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Email */}
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          {/* User Type */}
          <div className="flex items-start space-x-3">
            <UserCog className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1.5">User Type</p>
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as LimitedUserRole)}
                    open={editingRole}
                    onOpenChange={setEditingRole}
                  >
                    <SelectTrigger className="w-full pr-10">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setEditingRole(true)}
                  >
                    <span className="sr-only">Edit role</span>
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                  </Button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Limit */}
          <div className="flex items-start space-x-3">
            <ClipboardList className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1.5">Pending Limit</p>
              <div>
                <Input
                  type="number"
                  min={1}
                  max={MAX_PENDING_LIMIT}
                  value={pendingLimit}
                  onChange={handlePendingChange}
                  className={error ? "border-red-300 focus-visible:ring-red-300" : ""}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of pending requests allowed: {MAX_PENDING_LIMIT}
                </p>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-gray-900">{user.department || "—"}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Cellphone</p>
                <p className="text-gray-900">{user.cellphoneNumber || "—"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <PhoneCall className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Local Number</p>
                <p className="text-gray-900">{user.localNumber || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-3 w-full">
            <Button onClick={onClose} disabled={working} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={working || !!error} className="min-w-[100px] bg-indigo-Background">
              {working ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
