type ImplementationPlan = {
    id: string;
    description: string;
    status: string;
    files: Files[];
    serviceRequest: ServiceRequest[];
    tasks: Task[];
}

type Task = {
    id: string;
    name: string;
    deadline: Date;
    checked: boolean;
    endTime: Date;
    startTime: Date;
}


type Files = {
    id: string;
    implementationPlanId: string;
    url: string;
}
