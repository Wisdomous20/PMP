"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import { Plus, Trash, ListFilter, Pencil } from "lucide-react"; 
import AddPersonnel from "./AddPersonnel"; 
import UpdatePersonnel from "./updatePersonnel";
import { Checkbox } from "../ui/checkbox"; 

interface Personnel {
  id: string;
  name: string;
  department: string;
  position: string;
}

export default function PersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for Add dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false); // State for Update dialog
  const [currentPersonnel, setCurrentPersonnel] = useState<Personnel | null>(null); // State for current personnel being updated

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const response = await fetch("/api/manpower-management");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPersonnel(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching personnel:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/manpower-management/${id}`, { method: "DELETE" })
        )
      );
      setPersonnel((prev) => prev.filter((person) => !selectedIds.includes(person.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Error deleting personnel:", error);
    }
  };

  const openUpdateDialog = (person: Personnel) => {
    setCurrentPersonnel(person);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="p-4 flex flex-col w-screen">
      <div className="w-full max-w-10xl">
        <h1 className="text-md sm:text-2xl font-semibold text-indigo-text py-3">Personnel Management</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-md hidden sm:block w-full px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant={"gold"}
              className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md"
            >
              <ListFilter className="inline-block mr-2 w-4 h-4" /> Sort by
            </Button>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant={"gold"}
              onClick={() => setIsDialogOpen(true)} // Open Add dialog
              className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md"
            >
              <Plus className="inline-block mr-2 w-4 h-4" /> Add Personnel
            </Button>
            <Button
              variant={"gold"}
              onClick={handleDelete}
              className="bg-red-600 text-primary-foreground px-4 py-2 rounded-md"
            >
              <Trash className="inline-block mr-2 w-4 h-4" /> Delete Personnel
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

      <div className="rounded-md shadow-md overflow-hidden mx-auto w-full max-w-7xl mt-6">
        <div className="bg-transparent grid grid-cols-[30px_1fr_1fr_1fr_30px] items-center gap-4 px-4 py-2 font-semibold">
          <div className="text-center"></div>
          <div className="text-center">Name</div>
          <div className="text-center">Position</div>
          <div className="text-center">Department</div>
          <div className="text-center"></div>
        </div>

        <div className="mt-4">
          {personnel.map((person) => (
            <div
              key={person.id}
              className="bg-gray-300 border border-gray-300 rounded-md shadow-md mb-4 p-4 grid grid-cols-[30px_1fr_1fr_1fr_30px] items-center gap-4"
            >
              <div className="flex justify-center">
                <Checkbox
                  checked={selectedIds.includes(person.id)}
                  onCheckedChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(person.id)
                        ? prev.filter((id) => id !== person.id)
                        : [...prev, person.id]
                    )
                  }
                />
              </div>
              <div className="text-center">
                <p>{person.name}</p>
              </div>
              <div className="text-center">
                <p>{person.position}</p>
              </div>
              <div className="text-center">
                <p>{person.department}</p>
              </div>
              <div className="flex justify-center">
                <Pencil className="w-4 h-4 cursor-pointer" onClick={() => openUpdateDialog(person)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="gold" className="bg-indigo-Background text-white px-6 py-2 rounded-md">Load more...</Button>
      </div>
    </div>
  );
}
