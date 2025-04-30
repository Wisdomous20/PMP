
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import fetchCreateServiceRequest from "@/domains/service-request/services/fetchCreateServiceRequest";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";
import Concerns from "./Concerns";
import useGetSessionData from "@/domains/user-management/hooks/useGetSessionData";

import { useSelector, useDispatch } from "react-redux";
import {
  setConcern as setReduxConcern,
  setDetails as setReduxDetails,
  resetServiceRequest,
} from "@/store/slices/serviceRequestSlice";
import { RootState } from "@/store";

const predefinedConcerns = [
  { value: "Aircon", label: "Aircon" },
  { value: "Building & Toilets", label: "Building & Toilets" },
  { value: "Building Plans", label: "Building Plans" },
  { value: "Carpentry/Repainting/Building Repair", label: "Carpentry/Repainting/Building Repair" },
  { value: "CCTV Network", label: "CCTV Network" },
  { value: "Computer & Preipherals Specifications", label: "Computer & Preipherals Specifications" },
  { value: "Computer Equipment Repair", label: "Computer Equipment Repair" },
  { value: "Electrical", label: "Electrical" },
  { value: "Elevator", label: "Elevator" },
  { value: "Grounds/Hauling", label: "Grounds/Hauling" },
  { value: "MIS", label: "MIS" },
  { value: "Internet Connectivity", label: "Internet Connectivity" },
  { value: "Pest Control", label: "Pest Control" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Telephone Line", label: "Telephone Line" },
  { value: "Security & Safety", label: "Security & Safety" },
  { value: "Others", label: "Others" },
];

export default function CreateServiceRequest() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  }, [pathname, searchParams]);

  const dispatch = useDispatch();
  const { sessionData, loading } = useGetSessionData();
  const reduxConcern = useSelector((state: RootState) => state.serviceRequest.concern);
  const reduxDetails = useSelector((state: RootState) => state.serviceRequest.details);

  const [selectedConcern, setSelectedConcern] = useState<string>("");
  const [customConcern, setCustomConcern] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!reduxConcern) return;
    const found = predefinedConcerns.find(c => c.value === reduxConcern);
    if (found && found.value !== "Others") {
      setSelectedConcern(found.value);
      setCustomConcern("");
    } else {
      setSelectedConcern("Others");
      setCustomConcern(reduxConcern);
    }
  }, [reduxConcern]);

  const handleConcernSelect = (value: string) => {
    if (value === "Others") {
      setCustomConcern("");
      setSelectedConcern("Others");
      dispatch(setReduxConcern(''));
    } else {
      setCustomConcern("");
      setSelectedConcern(value);
      dispatch(setReduxConcern(value));
    }
  };

  const handleCustomConcernChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomConcern(val);
    if (selectedConcern === "Others") {
      dispatch(setReduxConcern(val));
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setReduxDetails(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const concern = reduxConcern;
    const details = reduxDetails;

    if (concern.trim() === "" || details.trim() === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const userId = sessionData?.user.id;
    if (!userId) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setIsLoading(true);
      const serviceRequest = await fetchCreateServiceRequest(userId, concern, details);
      console.log("Service request created:", serviceRequest);

      toast({
        title: "Success",
        description: "Your service request has been created!",
      });

      dispatch(resetServiceRequest());
      setSelectedConcern("");
      setCustomConcern("");

      router.push("/service-request/create/success");
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
        {/* ... skeleton markup ... */}
      </Skeleton>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg sm:rounded-md border-2 border-gray-300 shadow-xl overflow-hidden h-auto m-auto">
      <div className="p-5 bg-indigo-dark text-primary-foreground flex items-center">
        <h1 id="create-service-request-title" className="text-lg sm:text-xl font-semibold text-center xsm:text-left w-full">
          Create Service Request
        </h1>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <div className="space-y-2">
            <label htmlFor="concern" className="text-sm font-medium text-indigo-text">
              Concern/Work to be done
            </label>
            <Concerns concerns={predefinedConcerns} onSelect={handleConcernSelect} />
            {selectedConcern === "Others" && (
              <Input
                id="custom-concern"
                value={customConcern}
                onChange={handleCustomConcernChange}
                placeholder="Enter your custom concern..."
                className="w-full mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium text-indigo-text">
              Details
            </label>
            <Textarea
              id="details"
              value={reduxDetails}
              onChange={handleDetailsChange}
              placeholder="Type your message here"
              className="w-full h-full max-h-[300px] min-h-[150px] resize-none overflow-auto"
            />
          </div>
          {showLoginPrompt && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Login Required</h3>
              <p className="text-yellow-700 mb-4">
                You need to be logged in to submit a service request.
              </p>
              <div className="flex gap-4">
                <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>  
                  <Button className="bg-indigo-Background hover:bg-indigo-600 text-primary-foreground">
                    Login
                  </Button>
                </Link>
                <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}>  
                  <Button variant="outline" className="border-indigo-600 text-indigo-600">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto bg-indigo-Background" disabled={isLoading}>
              {isLoading ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Send id="send-service-request-button" className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
