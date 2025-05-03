"use client";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import fetchGetAllUsers from "@/domains/user-management/services/fetchGetAllUsers";
import UserDetails from "@/components/user-management/UserDetails";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
 
const handleUserClick = (user: User) => {
  setSelectedUser(user);
  setIsModalOpen(true);
};


useEffect(() => {
  const fetchUsers = async () => {
    const data = await fetchGetAllUsers();
    if (data) {
      setUsers(data);
      setLoading(false);
    }
  };
  fetchUsers();
}, []);

  
  const filteredUsers = users.filter((u) =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <Skeleton className="h-8 w-40 mb-6 shrink-0" />
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-10 w-6 rounded" />
          <Skeleton className="h-10 w-80 rounded" />
        </div>
        <Skeleton className="h-10 w-32 mb-2" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md mb-2">
            <Skeleton className="col-span-4 h-4" />
            <Skeleton className="col-span-5 h-4" />
            <Skeleton className="col-span-3 h-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 relative overflow-y-auto overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-6 shrink-0">User Management</h1>
  
      <div className="flex justify-between mb-6 shrink-0">
        <div className="relative flex items-center space-x-2">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
  
      <div className="overflow-y-auto flex-1 pr-2">
        <div className="sticky top-0 z-10 bg-yellow-300 rounded-t-md shadow-md mb-1">
          <div className="grid grid-cols-12 gap-4 px-6 py-5 text-base font-bold">
            <div className="col-span-4">Full Name</div>
            <div className="col-span-5">Email</div>
            <div className="col-span-3">User Type</div>
          </div>
        </div>
  
        <div className="space-y-2 mt-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-md">
              {searchTerm ? "No matching users found" : "No users found"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <div className="col-span-4 flex items-center">{`${user.firstName} ${user.lastName}`}</div>
                <div className="col-span-5 flex items-center">{user.email}</div>
                <div className="col-span-3 flex items-center text-gray-600">{user.user_type}</div>
              </div>
            ))
          )}
        </div>
      </div>
  
      <UserDetails
        user={selectedUser}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}