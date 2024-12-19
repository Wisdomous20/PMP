"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import fetchCreateServiceRequest from "@/domains/service-request/services/fetchCreateServiceRequest";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import useGetUserRole from "@/domains/user-management/hooks/useGetUserRole";
import { Skeleton } from "../ui/skeleton";

export default function CreateServiceRequest() {
  const [concern, setConcern] = useState("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const { userRole, loading:roleLoading } = useGetUserRole();

  useEffect(() => {
    if (!roleLoading) {
      setLoading(false);
    }
  }, [roleLoading]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (concern.trim() === "" || details.trim() === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const userId = session?.user.id;

      if (!userId) {
        throw new Error("User not logged in");
      }

      await fetchCreateServiceRequest(userId, concern, details);

      toast({
        title: "Success",
        description: "Your service request has been sent!",
      });

      setConcern("");
      setDetails("");
      router.push("/");
    } catch (error) {
      console.error("Failed to create service request:", error);
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Skeleton className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md xsm:rounded-xsm border-2 border-gray-300 shadow-xl overflow-hidden h-auto m-auto">
        
        {/* Header */}
        <div className="p-5 bg-gray-300 w-full flex items-center">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
  
        {/* Input */}
        <div className="p-6 space-y-6 flex flex-col">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
  
        {/* Textarea */}
        <div className="p-6 w-full h-full max-h-[300px] min-h-[150px] resize-none overflow-auto">
          <div className="h-6 bg-gray -300 rounded w-1/2"></div>
          <div className="h-32 bg-gray-300 rounded w-full"></div>
        </div>
  
        {/* Button */}
        <div className="p-5 h-10 bg-gray-300 rounded w-1/4 ml-auto flex justify-end flex-shrink-0"></div>
      </Skeleton>
    );
  }
  

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md xsm:rounded-xsm border-2 border-gray-300 shadow-xl overflow-hidden h-auto m-auto">
      <div className="p-5 bg-indigo-dark text-primary-foreground flex items-center">
        {/* <Button
          id="create-service-request-back-button"
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.push("/service-request")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button> */}
        <h1 
        id="create-service-request-title" 
        className="text-lg sm:text-xl font-semibold text-center xsm:text-left w-full">
          Create Service Request
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex flex-col">
        <div className="space-y-2 flex-shrink-0">
          <label htmlFor="title" className="text-sm font-medium text-indigo-text">
            Concern/Work to be done
          </label>
          <Input
            id="title"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="Enter the title of your service request"
            className="w-full"
          />
        </div>
        <div className="space-y-2 flex-grow">
          <label
            htmlFor="details"
            className="text-sm font-medium text-indigo-text"
          >
            Details
          </label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Type your message here"
            className="w-full h-full max-h-[300px] min-h-[150px] resize-none overflow-auto"
          />
        </div>
        <div className="flex justify-end flex-shrink-0">
          <Button type="submit" className="w-full sm:w-auto bg-indigo-Background" variant="gold"disabled={isLoading}>
            {isLoading ? (
              <Spinner className="w-4 h-4 mr-2" />
            ) : (
              <Send id="send-service-request-button" className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
