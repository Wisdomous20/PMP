/* eslint-disable @typescript-eslint/no-unused-vars */
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
import fetchAddRating from "@/domains/service-request/services/fetchAddRating";

interface ServiceRequestRatingProps {
  serviceRequestId: string;
}

const ServiceRequestRating: React.FC<ServiceRequestRatingProps> = ({
  serviceRequestId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [startOnTime, setStartOnTime] = useState("");
  const [achievedResults, setAchievedResults] = useState("");
  const [startReason, setStartReason] = useState("");
  const [resultReason, setResultReason] = useState("");
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startOnTime || !achievedResults || satisfaction === null || !feedback) {
      setFeedbackMessage("Please fill out all required fields.");
      return;
    }

    try {
      await fetchAddRating(serviceRequestId, rating, description, {
        startOnTime,
        startReason,
        achievedResults,
        resultReason,
        satisfaction,
        feedback,
      });
      setFeedbackMessage("Rating submitted successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setFeedbackMessage("Failed to submit rating. Please try again.");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Rate Service Request</Button>
      {feedbackMessage && <p>{feedbackMessage}</p>}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 bg-white rounded-lg w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {page === 1 ? "Project Start & Results" : "How satisfied are you?"}
            </DialogTitle>
          </DialogHeader>

          {page === 1 && (
            <DialogDescription>
              <p className="flex justify-center pb-2">Did the project start on time?</p>
              <div className="flex justify-center gap-4 mt-2">
                <Button onClick={() => setStartOnTime("yes")} variant={startOnTime === "yes" ? "default" : "outline"}>Yes</Button>
                <Button onClick={() => setStartOnTime("no")} variant={startOnTime === "no" ? "default" : "outline"}>No</Button>
              </div>
              {startOnTime === "no" && (
                <Textarea
                  placeholder="Tell us more..."
                  value={startReason}
                  onChange={(e) => setStartReason(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 mt-2"
                />
              )}

              <p className="mt-4 flex justify-center pb-2">Did the plan achieve the desired results?</p>
              <div className="flex justify-center gap-4 mt-2">
                <Button onClick={() => setAchievedResults("yes")} variant={achievedResults === "yes" ? "default" : "outline"}>Yes</Button>
                <Button onClick={() => setAchievedResults("no")} variant={achievedResults === "no" ? "default" : "outline"}>No</Button>
              </div>
              {achievedResults === "no" && (
                <Textarea
                  placeholder="Tell us more..."
                  value={resultReason}
                  onChange={(e) => setResultReason(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 mt-2"
                />
              )}
            </DialogDescription>
          )}

          {page === 2 && (
            <DialogDescription>
              <p className="mt-4">How satisfied are you?</p>
              <div className="flex flex-col items-center mt-4 w-full">
                <div className="flex justify-center gap-7">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSatisfaction(num)}
                      className={`w-10 h-10 rounded-full text-sm font-medium border transition-all duration-200 ${satisfaction === num ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
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
                placeholder="Tell us more..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 mt-4"
              />
            </DialogDescription>
          )}

          <DialogFooter>
            {page === 1 && (
              <Button className="bg-purple-600 text-white" onClick={() => setPage(2)}>Next</Button>
            )}
            {page === 2 && (
              <>
                <Button className="bg-purple-600 text-white" onClick={handleSubmit}>Submit</Button>
                <Button onClick={() => setPage(1)}>Back</Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceRequestRating;