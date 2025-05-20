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
    <div className="p-4 flex flex-col w-full">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-md sm:text-2xl font-semibold text-indigo-text py-3">
          Personnel Management
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-2 w-full sm:w-auto">
            <Search className="text-gray-500" size={20} />
            <Input
              type="text"
              placeholder="Search by name or position..."
              className="w-full sm:w-[280px] text-gray-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter size={16} />
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
            className="bg-indigo-Background text-primary-foreground w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Personnel
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

        <div className="rounded-md border shadow-sm overflow-hidden">
          <div className="overflow-y-visible">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Position</TableHead>
                  <TableHead className="text-center">Department</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
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
          <div className="flex items-center justify-between mt-4 py-2">
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
