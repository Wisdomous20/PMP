import ServiceRequestPreview from "./ServiceRequestPreview"

const mockRequests: ServiceRequest[] = [
  { requesterName: 'John Doe', title: 'New Equipment', details: 'Requesting a new laptop for development work', createdOn: '2023-10-15' },
  { requesterName: 'Jane Smith', title: 'Software License', details: 'Need a license for Adobe Creative Suite', createdOn: '2023-10-14' },
  { requesterName: 'Bob Johnson', title: 'Training Course', details: 'Approval for attending a React conference', createdOn: '2023-10-13' },
  { requesterName: 'Alice Brown', title: 'Office Supplies', details: 'Ordering new ergonomic chairs for the team', createdOn: '2023-10-12' },
  { requesterName: 'Charlie Wilson', title: 'Travel Approval', details: 'Business trip to New York for client meeting', createdOn: '2023-10-11' },
  { requesterName: 'John Doe', title: 'New Equipment', details: 'Requesting a new laptop for development work', createdOn: '2023-10-15' },
  { requesterName: 'Jane Smith', title: 'Software License', details: 'Need a license for Adobe Creative Suite', createdOn: '2023-10-14' },
  { requesterName: 'Bob Johnson', title: 'Training Course', details: 'Approval for attending a React conference', createdOn: '2023-10-13' },
  { requesterName: 'Alice Brown', title: 'Office Supplies', details: 'Ordering new ergonomic chairs for the team', createdOn: '2023-10-12' },
  { requesterName: 'Charlie Wilson', title: 'Travel Approval', details: 'Business trip to New York for client meeting', createdOn: '2023-10-11' },
  { requesterName: 'John Doe', title: 'New Equipment', details: 'Requesting a new laptop for development work', createdOn: '2023-10-15' },
  { requesterName: 'Jane Smith', title: 'Software License', details: 'Need a license for Adobe Creative Suite', createdOn: '2023-10-14' },
  { requesterName: 'Bob Johnson', title: 'Training Course', details: 'Approval for attending a React conference', createdOn: '2023-10-13' },
  { requesterName: 'Alice Brown', title: 'Office Supplies', details: 'Ordering new ergonomic chairs for the team', createdOn: '2023-10-12' },
  { requesterName: 'Charlie Wilson', title: 'Travel Approval', details: 'Business trip to New York for client meeting', createdOn: '2023-10-11' },
  { requesterName: 'John Doe', title: 'New Equipment', details: 'Requesting a new laptop for development work', createdOn: '2023-10-15' },
  { requesterName: 'Jane Smith', title: 'Software License', details: 'Need a license for Adobe Creative Suite', createdOn: '2023-10-14' },
  { requesterName: 'Bob Johnson', title: 'Training Course', details: 'Approval for attending a React conference', createdOn: '2023-10-13' },
  { requesterName: 'Alice Brown', title: 'Office Supplies', details: 'Ordering new ergonomic chairs for the team', createdOn: '2023-10-12' },
  { requesterName: 'Charlie Wilson', title: 'Travel Approval', details: 'Business trip to New York for client meeting', createdOn: '2023-10-11' },
  { requesterName: 'John Doe', title: 'New Equipment', details: 'Requesting a new laptop for development work', createdOn: '2023-10-15' },
  { requesterName: 'Jane Smith', title: 'Software License', details: 'Need a license for Adobe Creative Suite', createdOn: '2023-10-14' },
  { requesterName: 'Bob Johnson', title: 'Training Course', details: 'Approval for attending a React conference', createdOn: '2023-10-13' },
  { requesterName: 'Alice Brown', title: 'Office Supplies', details: 'Ordering new ergonomic chairs for the team', createdOn: '2023-10-12' },
  { requesterName: 'Charlie Wilson', title: 'Travel Approval', details: 'Business trip to New York for client meeting', createdOn: '2023-10-11' },
]

export default function ServiceRequestList() {
  return (
    <div className="w-full h-full overflow-y-scroll overflow-x-hidden">
      {mockRequests.map((request, index) => (
        <ServiceRequestPreview key={index} {...request} />
      ))}
    </div>
  )
}