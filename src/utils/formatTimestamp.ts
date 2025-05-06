import { format, isValid } from "date-fns";

export default function formatTimestamp(timestamp: Date): string {
  console.log(timestamp)
  console.log(isValid(timestamp))
  const date = new Date(timestamp);

  if (!isValid(date)) {
    return "Invalid Date";
  }

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
