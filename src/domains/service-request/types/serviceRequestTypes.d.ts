type ServiceRequest = {
  id: string
  requesterName: string;
  concern: string;
  details: string;
  createdOn: Date | null;
  status: Status[]
}

type GetServiceRequestInputs = {
  userType: "ADMIN" | "SUPERVISOR" | "USER";
  userId?: string;
  department?: string;
}

type Status = {
  id: string
  status: "pending" | "approved" | "rejected" | "in_progress" | "archive";
  timestamp: Date;
  note: string | null
}