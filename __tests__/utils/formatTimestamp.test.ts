import { format } from "date-fns";
import formatTimestamp from "../../src/utils/formatTimestamp";

describe("formatTimestamp", () => {
  it("should format as time (h:mm a) if the date is today", () => {
    const today = new Date();
    const formattedTime = format(today, "h:mm a");
    expect(formatTimestamp(today)).toBe(formattedTime);
  });

  it("should format as 'M/d/yy' if the date is in a different year", () => {
    const dateLastYear = new Date();
    dateLastYear.setFullYear(dateLastYear.getFullYear() - 1);
    const formattedDate = format(dateLastYear, "M/d/yy");
    expect(formatTimestamp(dateLastYear)).toBe(formattedDate);
  });
});