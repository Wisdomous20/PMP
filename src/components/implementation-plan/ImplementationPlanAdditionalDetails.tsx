'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AdditionalDetailsProps {
  setAdditionalDetails: React.Dispatch<React.SetStateAction<string>>; // Prop to update additional details in the parent
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ setAdditionalDetails }) => {
  const [details, setDetails] = useState<string>(''); // Local state for additional details

  // Update the parent component whenever the local details state changes
  useEffect(() => {
    setAdditionalDetails(details);
  }, [details, setAdditionalDetails]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(event.target.value); // Update local state with the textarea value
  };

  return (
    <div>
      <Label htmlFor="additional-details">Additional Details</Label>
      <Textarea
        id="additional-details"
        className="min-h-[100px]"
        value={details} // Controlled input
        onChange={handleChange} // Handle input changes
        placeholder="Enter any additional details here..."
      />
    </div>
  );
};

export default AdditionalDetails;