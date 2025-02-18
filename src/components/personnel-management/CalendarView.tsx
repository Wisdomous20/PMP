import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DayViewCalendar from "./DayViewCalendar";
import WeekViewCalendar from "./WeekViewCalendar";
import MonthViewCalendar from "./MonthViewCalendar";

interface CalendarViewProps {
  tasks: CalendarTask[];
}

export default function CalendarView({ tasks }: CalendarViewProps): JSX.Element {
  return (
    <div className="p-4 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-6 text-primary">Personnel Tasks</h1>
      <Tabs defaultValue="day" className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="day" className="flex-1">
            Day
          </TabsTrigger>
          <TabsTrigger value="week" className="flex-1">
            Week
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1">
            Month
          </TabsTrigger>
        </TabsList>
        <TabsContent value="day">
          <DayViewCalendar tasks={tasks} />
        </TabsContent>
        <TabsContent value="week">
          <WeekViewCalendar tasks={tasks} />
        </TabsContent>
        <TabsContent value="month">
          <MonthViewCalendar tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
