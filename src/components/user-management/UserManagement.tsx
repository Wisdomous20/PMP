"use client";
import { useEffect, useState } from "react";
import { Search, X} from "lucide-react";
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
  // const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null);

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

  const filteredUsers = users
    .filter((u) => u.user_type !== "ADMIN")
    .filter(
      (u) =>
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
          <div
            key={i}
            className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md mb-2"
          >
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
            {/* <div className="col-span-6"></div> */}

          </div>
        </div>

        <div className="space-y-2 mt-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-300 transition-colors cursor-pointer group"
            >
              <div
                className="col-span-4 flex items-center"
                onClick={() => handleUserClick(user)}
              >
                {`${user.firstName} ${user.lastName}`}
              </div>
              <div
                className="col-span-5 flex items-center"
                onClick={() => handleUserClick(user)}
              >
                {user.email}
              </div>
              <div className="col-span-3 flex items-center text-gray-600"
            onClick={() => handleUserClick(user)}
            >
                {user.user_type}
              </div>
              {/* <div className="col-span-1 flex items-center justify-center">
                <Dialog open={deleteDialogUser?.id === user.id} onOpenChange={open => setDeleteDialogUser(open ? user : null)}>
                  <DialogTrigger asChild>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setDeleteDialogUser(user);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete User</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete <b>{user.firstName} {user.lastName}</b>? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setDeleteDialogUser(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div> */}
            </div>
          ))}
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