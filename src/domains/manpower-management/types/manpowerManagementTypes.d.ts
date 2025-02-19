type Personnel = {
  id: string;
  name: string;
  position: string;
  department: string;
  tasks: CalendarTask[];
};

type CalendarTask = {
  id: string;
  title: string;
  start: Date; // Ensure these are Date objects when passed in
  end: Date;
};
