import React from 'react';
import ServiceRequestRating from './ServiceRequestRating';

const ServiceRequestRatingTest = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ServiceRequestRating Test</h1>
      <ServiceRequestRating serviceRequestId="test-id-123" />
    </div>
  );
};

export default ServiceRequestRatingTest;
