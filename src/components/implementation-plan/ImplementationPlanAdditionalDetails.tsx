'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AdditionalDetailsProps {
  setAdditionalDetails: React.Dispatch<React.SetStateAction<string>>; 
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({ setAdditionalDetails }) => {
  const [details, setDetails] = useState<string>(''); 


  useEffect(() => {
    setAdditionalDetails(details);
  }, [details, setAdditionalDetails]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(event.target.value);
  };

  return (
    <div>
      <Label htmlFor="additional-details">Additional Details</Label>
      <Textarea
        id="additional-details"
        className="min-h-[100px]"
        value={details} 
        onChange={handleChange}
        placeholder="Enter any additional details here..."
      />
    </div>
  );
};

export default AdditionalDetails;