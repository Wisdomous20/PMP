type ImplementationPlan = {
    id: string;
    description: string;
    status: string;
    serviceRequest: ServiceRequest;
    tasks: Task[];
    createdAt: Date
};

type ServiceRequest = {
    id: string;
    requesterName: string;
    concern: string;
    details: string;
    createdOn: Date | null;
    status: Status[];
    user: {
        firstName: string,
        lastName: string,
        email: string
    }
}

type Task = {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    checked: boolean;
};

type Assignment = {
  taskId: string;
  personnelId: string;
  assignedAt: Date;
};
