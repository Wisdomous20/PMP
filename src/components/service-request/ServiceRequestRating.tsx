import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import fetchCreateServiceRequestRating from '../../domains/service-request-rating/services/fetchCreateRating';

interface ServiceRequestRatingProps {
  serviceRequestId: string;
}

const ServiceRequestRating: React.FC<ServiceRequestRatingProps> = ({ serviceRequestId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [startOnTime, setStartOnTime] = useState("");
  const [achievedResults, setAchievedResults] = useState("");
  const [startReason, setStartReason] = useState('');
  const [resultReason, setResultReason] = useState('');
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchCreateServiceRequestRating(
        serviceRequestId,
        rating,
        description,
        {
          startOnTime,
          startReason,
          achievedResults,
          resultReason,
          satisfaction,
          feedback
        }
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Rate Service Request</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 bg-white rounded-lg w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {page === 1 ? "Project Start & Results" : "How satisfied are you?"}
            </DialogTitle>
          </DialogHeader>
          
          {page === 1 && (
            <DialogDescription>
              <div className="mt-4 space-y-2">
                <p>Did the project start on time?</p>
                <RadioGroup value={startOnTime} onValueChange={setStartOnTime}>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <RadioGroupItem value="no" />
                      <span>No</span>
                    </label>
                  </div>
                </RadioGroup>
                {startOnTime === 'no' && (
                  <Textarea 
                    placeholder="Tell us more..." 
                    value={startReason} 
                    onChange={(e) => setStartReason(e.target.value)} 
                    className="w-full border-gray-300 rounded-md p-2" 
                  />
                )}
              </div>
              
              <div className="mt-6">
                <p>Did the plan achieve the desired results?</p>
                <RadioGroup value={achievedResults} onValueChange={setAchievedResults}>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <RadioGroupItem value="no" />
                      <span>No</span>
                    </label>
                  </div>
                </RadioGroup>
                {achievedResults === 'no' && (
                  <Textarea 
                    placeholder="Tell us more..." 
                    value={resultReason} 
                    onChange={(e) => setResultReason(e.target.value)} 
                    className="w-full border-gray-300 rounded-md p-2" 
                  />
                )}
              </div>
            </DialogDescription>
          )}
          
          {page === 2 && (
            <DialogDescription>
              <p className="mt-4">How satisfied are you?</p>
              <div className="flex justify-between mt-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`w-10 h-10 rounded-full text-sm font-medium border ${satisfaction === num ? 'bg-purple-600 text-white' : 'border-gray-300 text-gray-600'}`}
                    onClick={() => setSatisfaction(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Textarea 
                  placeholder="Tell us more..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <Input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  placeholder="Enter overall rating (1-5)"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed description"
                  className="mt-2"
                />
              </div>
            </DialogDescription>
          )}

          <DialogFooter>
            {page === 1 && (
              <Button className="bg-purple-600 text-white" onClick={() => setPage(2)}>
                Next
              </Button>
            )}
            {page === 2 && (
              <>
                <Button className="bg-purple-600 text-white" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button onClick={() => setPage(1)}>
                  Back
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceRequestRating;
