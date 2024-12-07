'use client';

import { useEffect, useState } from 'react';
import RequesterDetails from './ImplementationPlanRequesterDetails';
import TaskList from './ImplementationPlanTaskList';
import FileUpload from './ImplementationPlanFileUpload';
import AdditionalDetails from './ImplementationPlanAdditionalDetails';
import fetchGetServiceRequestDetails from '@/domains/service-request/services/fetchGetServiceRequestById';
import fetchCreateImplementationPlan from '@/domains/implementation-plan/services/fetchCreateImplementationPlan';
import { toast } from "@/hooks/use-toast";

interface ImplementationPlanFormProps {
  serviceRequestId: string; 
}

const ImplementationPlanForm: React.FC<ImplementationPlanFormProps> = ({ serviceRequestId }) => {
  const [requesterDetails, setRequesterDetails] = useState({
    requesterName: '',
    requestDate: '',
    title: '',
    details: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [file, setFile] = useState<File | null>(null); 
  const [additionalDetails, setAdditionalDetails] = useState<string>(''); 

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const serviceRequest = await fetchGetServiceRequestDetails(serviceRequestId);
        if (serviceRequest) {
          setRequesterDetails({
            requesterName: serviceRequest.requesterName,
            requestDate: serviceRequest.createdOn ? new Date(serviceRequest.createdOn).toISOString().split('T')[0] : '',
            title: serviceRequest.concern,
            details: serviceRequest.details,
          });
        }
      } catch (err) {
        setError('Failed to load service request details.');
        toast({
          title: "Error",
          description:`Failed to load service request details. ${err}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [serviceRequestId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const implementationPlanData = {
      id: serviceRequestId, 
      description: additionalDetails,
      status: 'pending', 
      tasks,
      files: file ? [{ id: file.name, url: URL.createObjectURL(file) }] : [], // Handle file upload
    };
    try {
      await fetchCreateImplementationPlan(
        implementationPlanData.id,
        implementationPlanData.description,
        implementationPlanData.status,
        implementationPlanData.tasks,
        implementationPlanData.files
      );
      toast({
        title: "Success",
        description: "Implementation plan created successfully!",
      });
    } catch (error) {
      console.error('Failed to create implementation plan:', error);
      toast({
        title: "Error",
        description: "Failed to create implementation plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md xsm:rounded-xsm border-2 border-gray-300 shadow-xl overflow-y-auto h-screen mx-auto">
      <div className="p-5 bg-indigo-dark text-white flex items-center">
        <h1 className="text-lg sm:text-xl font-semibold text-center xsm:text-left w-full">
          Create Implementation Plan
        </h1>
      </div>
      <form className="p-6 space-y-6 flex flex-col" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <RequesterDetails
            requesterName={requesterDetails.requesterName}
            requestDate={requesterDetails.requestDate}
            title={requesterDetails.title}
            details={requesterDetails.details}
          />
        </div>
        <div className="space-y-4">
          <TaskList setTasks={setTasks} />
        </div>
        <div className="space-y-4">
          <FileUpload setFile={setFile} />
        </div>
        <div className="space-y-4">
          <AdditionalDetails setAdditionalDetails={setAdditionalDetails} />
        </div>
        <button type="submit" className="mt-4 bg-indigo-600 text-white rounded px-4 py-2">
          Submit Implementation Plan
        </button>
      </form>
    </div>
  );
};

export default ImplementationPlanForm;