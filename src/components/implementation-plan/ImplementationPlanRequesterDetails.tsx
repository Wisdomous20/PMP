'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RequesterDetailsProps {
  requesterName: string;
  requestDate: string;
  title: string;
  details: string;
}

const RequesterDetails: React.FC<RequesterDetailsProps> = ({ requesterName, requestDate, title, details }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Name of requester</Label>
          <Input id="name" value={requesterName} readOnly />
        </div>
        <div>
          <Label htmlFor="date">Request Date</Label>
          <Input id="date" type="date" value={requestDate} readOnly />
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title of Request</Label>
        <Input id="title" value={title} readOnly />
      </div>
      <div>
        <Label htmlFor="details">Details of the Request</Label>
        <Textarea id="details" className="min-h-[100px]" value={details} readOnly />
      </div>
    </>
  );
};

export default RequesterDetails;