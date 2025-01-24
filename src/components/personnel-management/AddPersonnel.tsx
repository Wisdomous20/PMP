import { useState } from "react";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 

interface AddPersonnelProps {
  onAdd: () => void; 
}

const AddPersonnel: React.FC<AddPersonnelProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState(""); // Added state for position

  const handleAddPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/manpower-management", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, department, position }), // Included position in the request body
    });
    if (response.ok) {
      onAdd(); 
      setName("");
      setDepartment("");
      setPosition(""); // Reset position state
    }
  };

  return (
    <form onSubmit={handleAddPersonnel} className="mb-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="mb-2"
      />
      <Input
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="Department"
        className="mb-2"
      />
      <Input
        value={position}
        onChange={(e) => setPosition(e.target.value)} // Added input for position
        placeholder="please enter your position ex: secretary"
        className="mb-2"
      />
      <Button type="submit">Add New</Button>
    </form>
  );
};

export default AddPersonnel;
