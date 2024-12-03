import { endOfDay } from "date-fns";

export const dateFormate = (value) => {
  if (!value) {
    return "";
  }
  let date = new Date(endOfDay(new Date(value)));

  // Set the time to 00:00:00.000 UTC
  date.setUTCHours(0, 0, 0, 0);

  // Convert the date to ISO string format
  let isoDate = date.toISOString();

  return isoDate;
};
