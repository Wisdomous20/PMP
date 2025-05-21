"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AddPersonnel from "./AddPersonnel";
import UpdatePersonnel from "./updatePersonnel";
import PersonnelCalendar from "./PersonnelCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Personnel {
  id: string;
  name: string;
  position: string;
  department: string;
  tasks: CalendarTask[];
}

export default function PersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentPersonnel, setCurrentPersonnel] = useState<Personnel | null>(
    null
  );
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  useEffect(() => {
    let filtered = personnel;

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (person) => person.department === selectedDepartment
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (person) =>
          person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPersonnel(filtered);
  }, [searchTerm, personnel, selectedDepartment]);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/manpower-management");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPersonnel(data);
        setFilteredPersonnel(data);
        const uniqueDepartments = Array.from(
          new Set(data.map((person) => person.department).filter(Boolean))
        ) as string[];

        setDepartments(uniqueDepartments);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching personnel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDelete = async (personId: string) => {
    try {
      await fetch(`/api/manpower-management/${personId}`, { method: "DELETE" });
      setPersonnel((prev) => prev.filter((person) => person.id !== personId));
    } catch (error) {
      console.error("Error deleting personnel:", error);
    }
  };

  const openUpdateDialog = (person: Personnel) => {
    setCurrentPersonnel(person);
    setIsUpdateDialogOpen(true);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof e === "string") {
      setSearchTerm(e);
    } else {
      setSearchTerm(e.target.value);
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
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
    <div className="flex-1 p-8 relative overflow-y-auto flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50 rounded-md overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 shrink-0">Personnel Management</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex items-center space-x-2">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search Personnel..."
              className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => handleSearchChange("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <Select
            value={selectedDepartment}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 bg-white">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.isArray(departments) &&
                departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={"default"}
          onClick={() => setIsDialogOpen(true)}
          className="bg-indigo-Background text-white w-full sm:w-auto hover:bg-indigo-900"
        >
          <Plus className="mr-2 h-4 w-4 font" /> Add Personnel
        </Button>
      </div>

      <AddPersonnel
        onAdd={fetchPersonnel}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <UpdatePersonnel
        onUpdate={fetchPersonnel}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        currentPersonnel={currentPersonnel}
      />

      <div className="rounded-t-md bg-yellow-400 shadow-md mb-1">
        <div className="grid grid-cols-12 gap-4 px-6 py-5 text-base font-bold text-gray-900">
          <div className="col-span-3 text-center">Name</div>
          <div className="col-span-3 text-center">Position</div>
          <div className="col-span-3 text-center">Department</div>
          <div className="col-span-3 text-center">Actions</div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px] space-y-2">
        {filteredPersonnel.length > 0 ? (
          filteredPersonnel.map((person) => (
            <div
              key={person.id}
              className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <div className="col-span-3 flex items-center justify-center">
                {person.name}
              </div>
              <div className="col-span-3 flex items-center justify-center">
                {person.position}
              </div>
              <div className="col-span-3 flex items-center justify-center">
                {person.department}
              </div>
              <div className="col-span-3 flex items-center justify-center gap-2">
                <PersonnelCalendar person={person} buttonOnly={true} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openUpdateDialog(person)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSingleDelete(person.id)}
                  title="Delete"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-md text-gray-500">
            {searchTerm
              ? "No personnel found matching your search"
              : "No personnel available"}
          </div>
        )}
      </div>
    </div>
  );
}
