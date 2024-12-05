'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RequesterDetailsProps {
  setRequesterDetails: React.Dispatch<React.SetStateAction<any>>;
}

const RequesterDetails: React.FC<RequesterDetailsProps> = ({ setRequesterDetails }) => {
  const [name, setName] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    setRequesterDetails({
      name,
      requestDate,
      title,
      details,
    });
  }, [name, requestDate, title, details, setRequesterDetails]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Name of requester</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date">Request Date</Label>
          <Input
            id="date"
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title of Request</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="details">Details of the Request</Label>
        <Textarea
          id="details"
          className="min-h-[100px]"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
    </>
  );
};

export default RequesterDetails;