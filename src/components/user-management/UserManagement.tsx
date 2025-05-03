 "use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import React from "react";
import { Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { User } from "@prisma/client";

const users = [
  {
    id: 1,
    name: "Sheree Laluma",
    email: "sheree@cpu.edu.ph",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Aljason Javier",
    email: "aljason@cpu.edu.ph",
    role: "Supervisor",
    status: "Active",
  },
  {
    id: 3,
    name: "Mykiell Pagayonan",
    email: "mykiell@cpu.edu.ph",
    role: "User",
    status: "Deactivated",
  },
  // Add more as needed
];

export default function UserManagement() {

  const [user, setUser] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  // const [visibleCount, setVisibleCount] = useState(5); // Start with 5 items

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

    return (
      <div className="flex-1 p-8 relative overflow-y-auto overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold mb-6 shrink-0">User Management</h1>
  
        {/* Table header (optional) */}
        <div className="sticky top-0 p-5 bg-yellow-300 rounded-t-md shadow-md mb-1"></div>
  
        {/* Table */}
        <div className="border border-t-0 rounded-b-md divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={()=> setSelectedUser(user)}
              className="flex items-center px-6 py-6 bg-white hover:bg-gray-50"
            >
              <input type="checkbox" className="mr-6 w-5 h-5" />
              <div className="flex-1 text-base">
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <div className="w-48 text-base text-gray-600">{user.role}</div>
              <div
                className={`w-36 text-base font-semibold ${
                  user.status === "Active" ? "text-green-600" : "text-red-500"
                }`}
              >
                {user.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}