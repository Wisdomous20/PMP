"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  return (
    <div className="p-4 flex flex-col w-screen">
      <div className="w-full max-w-10xl">
        <h1 className="text-md sm:text-2xl font-semibold text-indigo-text py-3">
          Personnel Management
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 w-2/3">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-md hidden sm:block w-1/2 px-4 py-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-[180px]">
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

          <div className="flex justify-end space-x-2">
            <Button
              variant={"gold"}
              onClick={() => setIsDialogOpen(true)}
              className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md"
            >
              <Plus className="inline-block mr-2 w-4 h-4" /> Add Personnel
            </Button>
          </div>
        </div>
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

      <div className="rounded-md shadow-md overflow-y-auto h-[500px] mx-auto w-full max-w-7xl mt-6 border p-4">
        <div className="bg-transparent grid grid-cols-[1fr_1fr_1fr_30px] items-center gap-4 px-4 py-2 font-semibold">
          <div className="text-center">Name</div>
          <div className="text-center">Position</div>
          <div className="text-center">Department</div>
          <div className="text-center"></div>
        </div>

        <div className="mt-4">
          {filteredPersonnel.length > 0 ? (
            filteredPersonnel.map((person) => (
              <PersonnelCalendar
                key={person.id}
                person={person}
                openUpdateDialog={openUpdateDialog}
                onDelete={handleSingleDelete}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No personnel found matching your search"
                : "No personnel available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
