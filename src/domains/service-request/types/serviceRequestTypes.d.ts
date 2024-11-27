type ServiceRequest = {
  id: string
  requesterName: string;
  title: string;
  details: string;
  createdOn: string;
}

type GetServiceRequestInputs = {
  userType: "ADMIN" | "SUPERVISOR" | "USER";
  userId?: string;
  department?: string;
}