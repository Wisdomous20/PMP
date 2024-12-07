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
    implementationPlanId: string;
    name: string;
    deadline: Date;
    checked: boolean;
}

type Files = {
    id: string;
    implementationPlanId: string;
    url: string;
}

