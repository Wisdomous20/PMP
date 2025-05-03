"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Plus,
  FileText,
  Archive,
  LogOut,
  Folder,
  User,
  Wrench,
  Home,
} from "lucide-react";
import Link from "next/link";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Skeleton } from "../ui/skeleton";

export default function LeftTab() {
  const { userRole, loading } = useGetUserRole();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (loading) {
    return (
      <div className="w-20 border-r bg-gray-300 flex flex-col items-center py-4 space-y-3">
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="sr-only">Loading CPU Logo</span>
        </Skeleton>
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Create Service Request Button</span>
        </Skeleton>
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Service Request List Button</span>
        </Skeleton>
        <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
          <span className="sr-only">Loading Archive Button</span>
        </Skeleton>
        <div className="absolute bottom-[40px]">
          <Skeleton className="w-11 h-12 bg-gray-300 rounded-md flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-md"></div>
            <span className="sr-only">Loading Logout Button</span>
          </Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-20 border-r bg-indigo-Background flex flex-col items-center py-4 space-y-5">
      {/* Logo */}
      <Button variant="gold" size="icon" className="w-10 h-10">
        <img src="/images/cpu-logo.png" alt="CPU Logo" className="w-10 h-10" />
        <span className="sr-only">CPU Logo</span>
      </Button>

      {/* Create Service Request */}
      {userRole === "USER" && (
        <Link href="/service-request/create">
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <Plus className="w-7 h-7" />
              <span className="sr-only">Create Service Request</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Create</span>
          </div>
        </Link>
      )}

      {/* Dashboard (Admin and Secretary) */}
      {(userRole === "ADMIN" || userRole === "SECRETARY") && (
        <Link href="/">
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <Home className="w-6 h-6" />
              <span className="sr-only">Dashboard</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Dashboard</span>
          </div>
        </Link>
      )}


      {/* Projects (For Supervisor, Admin and Secretary) */}
      {(userRole === "SUPERVISOR" || userRole === "ADMIN" || userRole === "SECRETARY") && (
        <Link href="/projects">
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <Folder className="w-6 h-6" />
              <span className="sr-only">Projects</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Projects</span>
          </div>
        </Link>
      )}

      {/* Service Request List */}
      <Link href="/service-request">
        <div className="flex flex-col items-center gap-1">
          <Button variant="gold" size="icon" className="w-10 h-10">
            <FileText className="w-6 h-6" />
            <span className="sr-only">Service Request List</span>
          </Button>
          <span className="text-xs text-white mt-[-6px] font-bold">Requests</span>
        </div>
      </Link>

      {/* Archive */}
      <Link href="/service-request/archive">
        <div className="flex flex-col items-center gap-1">
          <Button variant="gold" size="icon" className="w-10 h-10">
            <Archive className="w-6 h-6" />
            <span className="sr-only">Archive</span>
          </Button>
          <span className="text-xs text-white mt-[-6px] font-bold">Archives</span>
        </div>
      </Link>

      {/* Equipment Management (For Supervisor, Admin and Secretary) */}
      {(userRole === "SUPERVISOR" || userRole === "ADMIN" || userRole === "SECRETARY") && (
        <Link href="/inventory-management">
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <Wrench className="w-6 h-6" />
              <span className="sr-only">Equipment Management</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Equipment</span>
          </div>
        </Link>
      )}

      {/* Personnel Management (Admin and Secretary) */}
      {(userRole === "ADMIN" || userRole === "SECRETARY") && (
        <Link href="/personnel-management">
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <User className="w-6 h-6" />
              <span className="sr-only">Personnel Management</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Personnel</span>
          </div>
        </Link>
      )}

      {/* Sign Out at Bottom */}
      <div className="absolute bottom-[40px]">
        <Link href="/auth/login" onClick={handleLogout}>
          <div className="flex flex-col items-center gap-1">
            <Button variant="gold" size="icon" className="w-10 h-10">
              <LogOut className="w-6 h-6" />
              <span className="sr-only">Sign Out</span>
            </Button>
            <span className="text-xs text-white mt-[-6px] font-bold">Sign Out</span>
          </div>
        </Link>
      </div>
    </div>
  );
}


//   return (
//     <div className="w-20 border-r bg-indigo-Background flex flex-col items-center py-4 space-y-3">
//       <Button variant="gold" size="icon" className="w-11 h-12">
//         <img
//           src="/images/cpu-logo.png"
//           alt="CPU Logo"
//           className="w-8 h-8"
//         />
//         <span className="sr-only">CPU Logo</span>
//       </Button>

//       {userRole === "USER" && (
//         <Link href="/service-request/create">
//           <Button variant="gold" size="icon" className="w-11 h-12">
//             <Plus className="w-7 h-7" />
//             <span className="sr-only">Create Service Request</span>
//           </Button>
//         </Link>
//       )}

//       {(userRole === "SUPERVISOR" || userRole === "ADMIN") && (
//         <Link href="/projects">
//           <Button variant="gold" size="icon" className="w-11 h-12">
//             <Folder className="w-6 h-6" />
//             <span className="sr-only">Projects</span>
//           </Button>
//         </Link>
//       )}

//       <Link href="/service-request">
//         <Button variant="gold" size="icon" className="w-11 h-12">
//           <FileText className="w-6 h-6" />
//           <span className="sr-only">Service Request List</span>
//         </Button>
//       </Link>

//       <Link href="/service-request/archive">
//         <Button variant="gold" size="icon" className="w-11 h-12">
//           <Archive className="w-6 h-6" />
//           <span className="sr-only">Archive</span>
//         </Button>
//       </Link>

//       {userRole === "ADMIN" && ( // Conditional rendering for admin role
//         <Link href="/personnel-management">
//           <Button variant="gold" size="icon" className="w-11 h-12">
//             <User className="w-6 h-6" /> {/* User icon */}
//             <span className="sr-only">Personnel Management</span>
//           </Button>
//         </Link>
//       )}

//       <Link href="/auth/login" onClick={handleLogout}>
//         <Button variant="gold" size="icon" className="w-11 h-12">
//           <LogOut className="w-6 h-6" />
//           <span className="sr-only">Back</span>
//         </Button>
//       </Link>
//     </div>
//   );
// }
