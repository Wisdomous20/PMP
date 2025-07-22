"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Send, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { createServiceRequest } from "@/lib/service-request/create-service-request";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "../ui/skeleton";
import Concerns from "./Concerns";
import useGetSessionData from "@/domains/user-management/hooks/useGetSessionData";
import { canCreateServiceRequest } from "@/lib/service-request/can-create-server-request";

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

const MAX_LENGTH = {
  customConcern: 100,
  details: 2000,
};

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
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isFormComplete = useMemo(() => {
    return reduxConcern.trim() !== "" && reduxDetails.trim() !== "" && agreedToPrivacy && agreedToTerms;
  }, [reduxConcern, reduxDetails, agreedToPrivacy, agreedToTerms]);

  useEffect(() => {
    if (!reduxConcern) return;

    const found = predefinedConcerns.find(c => c.value === reduxConcern);

    if (found) {
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

    if (!isFormComplete) {
      if (!agreedToPrivacy || !agreedToTerms) {
        toast({
          title: "Validation Error",
          description: "Please agree to the Privacy Policy and Terms and Conditions.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedConcern === "Others" && reduxConcern.length > MAX_LENGTH.customConcern) {
      toast({
        title: "Validation Error",
        description: `Custom concern cannot exceed ${MAX_LENGTH.customConcern} characters.`,
        variant: "destructive",
      });
      return;
    }

    if (reduxDetails.length > MAX_LENGTH.details) {
      toast({
        title: "Validation Error",
        description: `Details cannot exceed ${MAX_LENGTH.details} characters.`,
        variant: "destructive",
      });
      return;
    }

    const concern = reduxConcern;
    const details = reduxDetails;

    const userId = sessionData?.user.id;
    if (!userId) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setIsLoading(true);

      const canCreateResponse = await canCreateServiceRequest(userId);

      if (!canCreateResponse) {
        toast({
          title: "Error",
          description: "Unable to verify service request eligibility. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!canCreateResponse.allowed) {
        if (canCreateResponse.hasUnratedCompleted) {
          toast({
            title: "Cannot Create Service Request",
            description: "You have unrated completed service requests. Please rate them first before creating a new service request.",
            variant: "destructive",
          });
        } else if (canCreateResponse.reachedPendingLimit) {
          toast({
            title: "Cannot Create Service Request",
            description: "You have reached the maximum number of pending service requests. Please wait for them to be completed or cancelled before creating a new one.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Cannot Create Service Request",
            description: "You are unable to create a new service request at this time.",
            variant: "destructive",
          });
        }
        return;
      }

      await createServiceRequest(userId, concern, details);

      toast({
        title: "Success",
        description: "Your service request has been created!",
      });

      dispatch(resetServiceRequest());
      setSelectedConcern("");
      setCustomConcern("");
      setAgreedToPrivacy(false);
      setAgreedToTerms(false);

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
      <div className="w-full max-w-2xl m-auto">
        <Card className="shadow-xl border-2 border-gray-300">
          <Skeleton className="h-[600px] rounded-lg" />
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl m-auto">
      <Card className="shadow-xl border-2 border-gray-300">
        <CardHeader className="bg-indigo-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <CardTitle className="text-lg sm:text-xl font-semibold">Create Service Request</CardTitle>
          </div>
          <CardDescription className="text-blue-100 mt-1">
            Fill out the form below to submit your service request
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="concern" className="text-sm font-medium text-indigo-text block">
                Concern/Work to be done
              </label>
              <Concerns
                concerns={predefinedConcerns}
                onSelect={handleConcernSelect}
                value={selectedConcern}
              />
              {selectedConcern === "Others" && (
                <Input
                  id="custom-concern"
                  value={customConcern}
                  onChange={handleCustomConcernChange}
                  placeholder="Enter your custom concern..."
                  className="w-full mt-2"
                  maxLength={MAX_LENGTH.customConcern}
                />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium text-indigo-text block">
                Details
              </label>
              <Textarea
                id="details"
                value={reduxDetails}
                onChange={handleDetailsChange}
                placeholder="Please provide detailed information about your request..."
                className="w-full h-full max-h-[300px] min-h-[150px] resize-none overflow-auto"
                maxLength={MAX_LENGTH.details}
              />
              <p className="text-xs text-gray-500">{reduxDetails.length}/{MAX_LENGTH.details}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-indigo-text">
                  Your request will be reviewed within 1 to 2 Business Days. For urgent matters, please contact our support team
                  directly at ovpa@cpu.edu.ph.
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    className="data-[state=checked]:bg-indigo-500 hover:cursor-pointer border-indigo-300"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                    disabled={isLoading}
                  />
                  <div className="text-indigo-text text-sm leading-tight">
                    By providing your data & submitting, you consent to our{" "}
                    <Link href="/privacy-policy" className="text-indigo-600 inline mx-1 hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    className=" data-[state=checked]:bg-indigo-500 hover:cursor-pointer border-indigo-300"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <div className="text-indigo-text text-sm leading-tight">
                    I have read the{" "}
                    <Link href="/terms-and-conditions" className="text-indigo-600 inline mx-1 hover:underline">
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {showLoginPrompt && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Login Required</h3>
                <p className="text-yellow-700 mb-4">
                  You need to be logged in to submit a service request.
                </p>
                <div className="flex gap-4">
                  <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between items-center px-6 py-4 bg-slate-50 rounded-b-lg border-t">
          <p className="text-sm text-gray-500">All fields are required</p>
          <Button
            type="submit"
            onClick={handleSubmit}
            className={`${isFormComplete && !isLoading && !showLoginPrompt
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!isFormComplete || isLoading || showLoginPrompt}
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Request
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}