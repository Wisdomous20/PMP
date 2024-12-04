type ImplementationPlan = {
    id: string;
    description: string;
    status: string;
    tasks: Tasks[];
    file: Files[];
    ServiceRequest: ServiceRequest[];

}

type Tasks = {
    id: string;
    name: string;
    deadline: Date;
    checked: boolean;
}

type Files = {
    id: string;
    url: string;
}


