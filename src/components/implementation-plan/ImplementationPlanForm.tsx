'use client';

import { useState } from 'react';
import RequesterDetails from '../implementation-plan/ImplementationPlanRequesterDetails';
import TaskList from '../implementation-plan/ImplementationPlanTaskList';
import FileUpload from '../implementation-plan/ImplementationPlanFileUpload';
import AdditionalDetails from '../implementation-plan/ImplementationPlanAdditionalDetails';
import { toast } from "@/hooks/use-toast"; 
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"


interface Task {
  id: string;
  implementationPlanId: string;
  name: string;
  deadline: Date;
  checked: boolean;
}

export default function ImplementationPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [requesterDetails, setRequesterDetails] = useState({}); 
  const [tasks, setTasks] = useState<Task[]>([]); // Explicitly type tasks as Task[]
  const [additionalDetails, setAdditionalDetails] = useState(''); // State for additional details
  const [file, setFile] = useState<File | null>(null); // State for file upload
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!requesterDetails || tasks.length === 0 || !additionalDetails) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const id = session?.user.id; // Get user ID from session
    if (!id) {
      toast({
        title: "Error",
        description: "User  ID is not available. Please log in.",
        variant: "destructive",
      });
      return;
    }


    try {
      setIsLoading(true);

      // Prepare the data to be sent
      const id = session?.user.id; // Assuming you have an ID in requesterDetails
      const description = additionalDetails; // Use additional details as description
      const status = "Pending"; // Set a default status or derive it from your logic
      const files = file ? [{ id: file.name, url: URL.createObjectURL(file) }] : []; // Create a file object if a file is uploaded

      const response = await fetchCreateImplementationPlan(id, description, status, tasks, files);

      if (!response.ok) {
        throw new Error("Failed to create implementation plan");
      }

      toast({
        title: "Success",
        description: "Your implementation plan has been created!",
      });

      // Reset form fields
      setRequesterDetails({});
      setTasks([]);
      setAdditionalDetails('');
      setFile(null);
      router.push("/"); 
    } catch (error) {
      console.error("Failed to create implementation plan:", error);
      toast({
        title: "Error",
        description: "Failed to create implementation plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md xsm:rounded-xsm border-2 border-gray-300 shadow-xl overflow-y-auto h-screen mx-auto">
      <div className="p-5 bg-indigo-dark text-white flex items-center">
        <h1
          id="create-implementation-plan-title"
          className="text-lg sm:text-xl font-semibold text-center xsm:text-left w-full"
        >
          Create Implementation Plan
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex flex-col">
        {/* Requester Details Section */}
        <div className="space-y-4">
          <RequesterDetails setRequesterDetails={setRequesterDetails} />
        </div>
        {/* Task List Section */}
        <div className="space-y-4">
          <TaskList setTasks={setTasks} />
        </div>
        {/* File Upload Section */}
        <div className="space-y-4">
        <FileUpload setFile={setFile} />
        </div>
        {/* Additional Details Section */}
        <div className="space-y-4">
          <AdditionalDetails setAdditionalDetails={setAdditionalDetails} />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end flex-shrink-0">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-indigo-dark text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
          