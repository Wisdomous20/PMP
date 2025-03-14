// lib/universalTasks.ts

export type CalendarTask = {
  id: number;
  title: string;
  start: Date; // Full date/time for task start
  end: Date;   // Full date/time for task end
};

// Helper: Get a random Date between two dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper: Add hours to a date
function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Generate a large sample of universal tasks
export const sampleCalendarTasks: CalendarTask[] = Array.from({ length: 100 }, (_, i) => {
  // Generate a random start date within 2025
  const start = randomDate(new Date(2025, 0, 1), new Date(2025, 11, 31));
  // Duration between 0.5 and 3 hours
  const duration = 0.5 + Math.random() * 2.5;
  const end = addHours(start, duration);
  return {
    id: i + 1,
    title: `Task ${i + 1}`,
    start,
    end,
  };
});
