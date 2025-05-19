"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddPersonnel from "./AddPersonnel";
import UpdatePersonnel from "./updatePersonnel";
import PersonnelCalendar from "./PersonnelCalendar";

export default function PersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentPersonnel, setCurrentPersonnel] = useState<Personnel | null>(null);
  
  useEffect(() => {
    fetchPersonnel();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPersonnel(personnel);
    } else {
      const filtered = personnel.filter(person => 
        person.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        person.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPersonnel(filtered);
    }
  }, [searchTerm, personnel]);

  const fetchPersonnel = async () => {
    try {
      const response = await fetch("/api/manpower-management");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPersonnel(data);
        setFilteredPersonnel(data);
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

  return (
    <div className="p-4 flex flex-col w-screen">
      <div className="w-full max-w-10xl">
        <h1 className="text-md sm:text-2xl font-semibold text-indigo-text py-3">
          Personnel Management
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-md hidden sm:block w-full px-4 py-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant={"gold"}
              onClick={() => setIsDialogOpen(true)}
              className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md"
            >
              <Plus className="inline-block mr-2 w-4 h-4" /> Add Personnel
            </Button>
            {/* <Button
              variant={"gold"}
              onClick={handleDelete}
              className="bg-red-600 text-primary-foreground px-4 py-2 rounded-md"
            >
              <Trash className="inline-block mr-2 w-4 h-4" /> Delete Personnel
            </Button> */}
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

      {/* Scrollable Container */}
      <div className="rounded-md shadow-md overflow-y-auto h-[500px] mx-auto w-full max-w-7xl mt-6 border p-4">
        <div className="bg-transparent grid grid-cols-[1fr_1fr_1fr_30px] items-center gap-4 px-4 py-2 font-semibold">
          {/* <div className="text-center"></div> */}
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
                // selectedIds={selectedIds}
                // setSelectedIds={setSelectedIds}
                openUpdateDialog={openUpdateDialog}
                onDelete={handleSingleDelete}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No personnel found matching your search" : "No personnel available"}
            </div>
          )}
        </div>
      </div>

      {/* Load More Button */}
      {/* {visibleCount < personnel.length && (
        <div className="flex justify-center mt-4">
          <Button
            variant="gold"
            className="bg-indigo-Background text-white px-6 py-2 rounded-md"
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            Load more...
          </Button>
        </div>
      )} */}
    </div>
  );
}