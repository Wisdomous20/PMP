import { format } from "date-fns";
import formatTimestamp from "../../src/utils/formatTimestamp";

describe("formatTimestamp", () => {
  it("should format as time if the date is today", () => {
    const timestamp = new Date().toISOString(); // Current date
    const formattedTime = format(new Date(timestamp), "h:mm a");
    expect(formatTimestamp(timestamp)).toBe(formattedTime);
  });

  it("should format as 'MMM d' if the date is within the same year but not today", () => {
    const dateThisYear = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(); // A date one month ago
    const formattedDate = format(new Date(dateThisYear), "MMM d");
    expect(formatTimestamp(dateThisYear)).toBe(formattedDate);
  });

  it("should format as 'M/d/yy' if the date is in a different year", () => {
    const dateLastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(); // A date last year
    const formattedDate = format(new Date(dateLastYear), "M/d/yy");
    expect(formatTimestamp(dateLastYear)).toBe(formattedDate);
  });
});
