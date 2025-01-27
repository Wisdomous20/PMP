"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import { Plus, Trash, ListFilter } from "lucide-react"; 
import AddPersonnel from "./AddPersonnel"; 
import { Checkbox } from "../ui/checkbox"; 

type Personnel = {
  id: string;
  name: string;
  position: string;
  department: string;
};

export default function PersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]); 
  const [showAddPersonnel, setShowAddPersonnel] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // State for selected personnel IDs

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

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => 
        fetch(`/api/manpower-management/${id}`, { method: 'DELETE' })
      ));
      setPersonnel((prev) => prev.filter(person => !selectedIds.includes(person.id)));
      setSelectedIds([]); // Clear selected IDs after deletion
    } catch (error) {
      console.error("Error deleting personnel:", error);
    }
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
            <Button variant={"gold"} className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md">
              <ListFilter className="inline-block mr-2 w-4 h-4" /> Sort by
            </Button>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant={"gold"} onClick={() => setShowAddPersonnel(!showAddPersonnel)} className="bg-indigo-Background text-primary-foreground px-4 py-2 rounded-md">
              <Plus className="inline-block mr-2 w-4 h-4" /> Add Personnel
            </Button>
            <Button variant={"gold"} onClick={handleDelete} className="bg-red-600 text-primary-foreground px-4 py-2 rounded-md">
              <Trash className="inline-block mr-2 w-4 h-4" /> Delete Personnel
            </Button>
          </div>
        </div>
      </div>

      {showAddPersonnel && <AddPersonnel onAdd={fetchPersonnel} />}

      <div className="rounded-md shadow-md overflow-hidden mx-auto w-full max-w-5xl mt-6">
        <div className="bg-transparent grid grid-cols-[30px_1fr_1fr_1fr] items-center gap-4 px-4 py-2 font-semibold">
          <div className="text-center"></div>
          <div className="text-center">Name</div>
          <div className="text-center">Position</div>
          <div className="text-center">Department</div>
        </div>

        <div className="mt-4">
          {personnel.map((person) => (
            <div
              key={person.id}
              className="bg-gray-300 border border-gray-300 rounded-md shadow-md mb-4 p-4 grid grid-cols-[30px_1fr_1fr_1fr] items-center gap-4"
            >
              <div className="flex justify-center">
                <Checkbox 
                  checked={selectedIds.includes(person.id)} 
                  onCheckedChange={() => handleCheckboxChange(person.id)} 
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
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
          Load more...
        </button>
      </div>
    </div>
  );
}
