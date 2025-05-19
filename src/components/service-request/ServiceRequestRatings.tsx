import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import fetchAddRating from "@/domains/rating/service/fetchAddRating";

interface RatingFormData {
  startOnTime: string;
  startReason?: string;
  achievedResults: string;
  resultReason?: string;
  satisfaction: number | null;
  feedback: string;
}

interface ServiceRequestRatingProps {
  serviceRequestId: string;
  onSuccessfulSubmit?: () => void;
}

const ServiceRequestRating: React.FC<ServiceRequestRatingProps> = ({
  serviceRequestId,
  onSuccessfulSubmit,
}) => {
  const [formState, setFormState] = useState<RatingFormData>({
    startOnTime: "",
    startReason: "",
    achievedResults: "",
    resultReason: "",
    satisfaction: null,
    feedback: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleInputChange = (
    field: keyof RatingFormData,
    value: string | number | null
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateFirstPage = () => {
    return formState.startOnTime && formState.achievedResults;
  };

  const validateSecondPage = () => {
    return formState.satisfaction !== null && formState.feedback.trim() !== "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFirstPage() || !validateSecondPage()) {
      setFeedbackMessage("Please fill out all required fields.");
      return;
    }

    try {
      // Pass the actual satisfaction rating value instead of hardcoded 0
      await fetchAddRating(
        serviceRequestId,
        formState.satisfaction!, // Use the user's selected rating
        formState.feedback, // Use the feedback text as the description
        {
          startOnTime: formState.startOnTime,
          startReason: formState.startReason || null,
          achievedResults: formState.achievedResults,
          resultReason: formState.resultReason || null,
          satisfaction: formState.satisfaction!,
          feedback: formState.feedback,
        }
      );

      setFeedbackMessage("Rating submitted successfully!");
      setIsOpen(false);

      if (onSuccessfulSubmit) {
        onSuccessfulSubmit();
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setFeedbackMessage("Failed to submit rating. Please try again.");
    }
  };

  const renderFirstPage = () => (
    <DialogDescription>
      <p className="flex justify-center pb-2">Did the project start on time?</p>
      <div className="flex justify-center gap-4 mt-2">
        {["yes", "no"].map((option) => (
          <Button
            key={option}
            onClick={() => handleInputChange("startOnTime", option)}
            variant={formState.startOnTime === option ? "default" : "outline"}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </div>

      {formState.startOnTime === "no" && (
        <Textarea
          placeholder="Tell us more about the delay..."
          value={formState.startReason || ""}
          onChange={(e) => handleInputChange("startReason", e.target.value)}
          className="w-full border-gray-300 rounded-md p-2 mt-2"
        />
      )}

      <p className="mt-4 flex justify-center pb-2">
        Did the plan achieve the desired results?
      </p>
      <div className="flex justify-center gap-4 mt-2">
        {["yes", "no"].map((option) => (
          <Button
            key={option}
            onClick={() => handleInputChange("achievedResults", option)}
            variant={
              formState.achievedResults === option ? "default" : "outline"
            }
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </div>

      {formState.achievedResults === "no" && (
        <Textarea
          placeholder="Tell us more about why results were not achieved..."
          value={formState.resultReason || ""}
          onChange={(e) => handleInputChange("resultReason", e.target.value)}
          className="w-full border-gray-300 rounded-md p-2 mt-2"
        />
      )}
    </DialogDescription>
  );

  const renderSecondPage = () => (
    <DialogDescription>
      <p className="mt-4">How satisfied are you?</p>
      <div className="flex flex-col items-center mt-4 w-full">
        <div className="flex justify-center gap-7">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleInputChange("satisfaction", num)}
              className={`w-10 h-10 rounded-full text-sm font-medium border transition-all duration-200 ${
                formState.satisfaction === num
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between w-[315px] mt-2 text-xs text-gray-600">
          <span className="w-12 text-center">Very Dissatisfied</span>
          <span className="w-10 text-center">Neutral</span>
          <span className="w-10 text-center">Very Satisfied</span>
        </div>
      </div>
      <Textarea
        placeholder="Remarks..."
        value={formState.feedback}
        onChange={(e) => handleInputChange("feedback", e.target.value)}
        className="w-full border-gray-300 rounded-md p-2 mt-4"
      />
    </DialogDescription>
  );

  return (
    <div className="flex flex-row">
      <Button onClick={() => setIsOpen(true)}>Rate Service Request</Button>

      {feedbackMessage && (
        <div className="mt-2 text-sm text-red-500">{feedbackMessage}</div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 bg-white rounded-lg w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {page === 1
                ? "Project Start & Results"
                : "How satisfied are you?"}
            </DialogTitle>
          </DialogHeader>

          {page === 1 ? renderFirstPage() : renderSecondPage()}

          <DialogFooter>
            {page === 1 && (
              <Button
                className="bg-purple-600 text-white"
                onClick={() => validateFirstPage() && setPage(2)}
                disabled={!validateFirstPage()}
              >
                Next
              </Button>
            )}

            {page === 2 && (
              <>
                <Button
                  className="bg-purple-600 text-white"
                  onClick={handleSubmit}
                  disabled={!validateSecondPage()}
                >
                  Submit
                </Button>
                <Button onClick={() => setPage(1)}>Back</Button>
              </>
            )}

            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceRequestRating;
