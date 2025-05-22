"use client";

import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import fetchGetAllUsers from "@/domains/user-management/services/fetchGetAllUsers";
import UserDetails from "@/components/user-management/UserDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userTypeFilter, setUserTypeFilter] = useState<string>("ALL");

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // const handleDeleteUser = async (user: User) => {
  //   try {
  //     await fetchDeleteUser(user.id);
  //     setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
  //     setSelectedUser(null);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   } finally {
  //     setDeleteDialogUser(null);
  //   }
  // };

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userTypeFilter]);

  const filteredUsers = users
    .filter((u) => u.user_type !== "ADMIN")
    .filter(
      (u) =>
        (userTypeFilter === "ALL" || u.user_type === userTypeFilter) &&
        (u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <Skeleton className="h-8 w-32 mb-6 shrink-0" />

        <div className="flex justify-between mb-6 shrink-0">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-6 rounded" />
            <Skeleton className="h-10 w-80 rounded" />
          </div>
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        <div className="bg-gray-200 rounded-t-md">
          <div className="grid grid-cols-12 gap-4 px-6 py-5">
            <div className="col-span-1" />
            <Skeleton className="col-span-2 h-6" />
            <Skeleton className="col-span-3 h-6" />
            <Skeleton className="col-span-3 h-6" />
            <Skeleton className="col-span-2 h-6" />
          </div>
        </div>

        <div className="space-y-2 mt-2 overflow-y-auto flex-1 pr-2">
          {[...Array(9)].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md"
            >
              <div className="col-span-1 flex items-center justify-center">
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 relative flex flex-col w-full h-full bg-gradient-to-b from-yellow-50 to-blue-50 ">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="flex justify-between mb-6">
          <div className="flex items-center space-x-3">
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

            <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <Filter size={16} />
                <SelectValue
                  placeholder={
                    userTypeFilter === "ALL" ? "All Users" : userTypeFilter
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Users</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="SECRETARY">Secretary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="rounded-t-md shadow-md bg-yellow-500 hover:bg-yellow-500 h-16">
                <TableHead className="w-1/3 py-3 text-center text-base font-bold text-black">
                  Full Name
                </TableHead>
                <TableHead className="w-1/3 py-3 text-center text-base font-bold text-black">
                  Email
                </TableHead>
                <TableHead className="w-1/3 py-3 text-center text-base font-bold text-black">
                  User Type
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <TableCell className="text-center py-3">{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell className="text-center py-3">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center py-3 text-gray-600">
                    {user.user_type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search criteria.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-b from-yellow-50 to-blue-50 p-4 z-10">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <UserDetails
        user={selectedUser}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
