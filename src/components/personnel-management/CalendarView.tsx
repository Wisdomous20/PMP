// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DayViewCalendar from "./DayViewCalendar";
// import WeekViewCalendar from "./WeekViewCalendar";
import MonthViewCalendar from "./MonthViewCalendar";

interface CalendarViewProps {
  tasks: CalendarTask[];
  personName: string;  // Added prop for the person's name
}

export default function CalendarView({ tasks, personName }: CalendarViewProps): JSX.Element {
  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-primary">{personName}&apos;s Tasks</h1>

      <MonthViewCalendar tasks={tasks} />
    </div>
  );
}
