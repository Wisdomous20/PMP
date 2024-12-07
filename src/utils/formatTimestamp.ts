import { format } from "date-fns";

export default function formatTimestamp(timestamp: Date) : string {
  const date = new Date(timestamp);
  const today = new Date();

  const isSameDay = today.toDateString() === date.toDateString();
  const isSameYear = today.getFullYear() === date.getFullYear();

  if (isSameDay) {
    return format(date, "h:mm a");
  }

  if (isSameYear) {
    return format(date, "MMM d");
  }

  return format(date, "M/d/yy");
}
