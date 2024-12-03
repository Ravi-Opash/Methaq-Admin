import { format, isValid } from "date-fns";

export const dateToShortDate = (date) => {
  if (isValid(new Date(date))) {
    return format(new Date(date), "do MMM");
  } else {
    return "";
  }
};
