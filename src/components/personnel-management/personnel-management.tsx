"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
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

  const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPersonnel = filteredPersonnel.slice(startIndex, endIndex);

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

  return (
    <div className="p-4 flex flex-col w-full h-full">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold mb-6">Personnel Management</h1>

          <div className="flex justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center space-x-2">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name or position..."
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

              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter size={16} />
                  <SelectValue
                    placeholder={
                      selectedDepartment === "all"
                        ? "All Departments"
                        : selectedDepartment
                    }
                  />
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
              className="bg-indigo-Background text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Personnel
            </Button>
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

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="rounded-t-md shadow-md">
                  <TableHead className="w-[33%] py-5 text-base font-bold text-center">
                    Full Name
                  </TableHead>
                  <TableHead className="w-[33%] py-5 text-base font-bold text-center">
                    Position
                  </TableHead>
                  <TableHead className="w-[33%] py-5 text-base font-bold text-center">
                    Department
                  </TableHead>
                  <TableHead className="w-[33%] py-5 text-base font-bold text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPersonnel.length > 0 ? (
                  displayedPersonnel.map((person) => (
                    <TableRow key={person.id} className="bg-muted/50">
                      <TableCell className="text-center">
                        {person.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {person.position}
                      </TableCell>
                      <TableCell className="text-center">
                        {person.department}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PersonnelCalendar
                            person={person}
                            buttonOnly={true}
                          />
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm || selectedDepartment !== "all"
                        ? "No personnel found matching your search"
                        : "No personnel available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {filteredPersonnel.length > 0 && (
          <div className="flex items-center justify-between mt-4 py-2 shrink-0">
            <div className="text-sm text-gray-600"></div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
