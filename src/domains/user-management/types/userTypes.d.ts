type Supervisor = {
  id: string;
  firstName: string;
  lastName: string;
  department: string | null;
}

type UserRole = 'ADMIN' | 'SUPERVISOR' | 'USER' | null;