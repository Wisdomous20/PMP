"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import AddPersonnel from "./AddPersonnel"; 

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

  return (
    <div className="p-4 flex flex-col items-center w-screen">
      <div className="w-full max-w-5xl">
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
            <Button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
              Sort by
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddPersonnel(!showAddPersonnel)} className="bg-green-600 text-white px-4 py-2 rounded-md">
              Add Personnel
            </Button>
            <Button className="bg-red-600 text-white px-4 py-2 rounded-md">
              Delete Personnel
            </Button>
          </div>
        </div>
      </div>

      {showAddPersonnel && <AddPersonnel onAdd={fetchPersonnel} />}

      {/* Table */}
      <div className="border rounded-md shadow-md overflow-hidden mx-auto w-full max-w-5xl">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Department</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person, index) => (
              <tr key={person.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-4 py-2">{person.name}</td>
                <td className="px-4 py-2">{person.position}</td>
                <td className="px-4 py-2">{person.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
          Load more...
        </button>
      </div>
    </div>
  );
}
