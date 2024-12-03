export const numberToMonth = (number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (number >= 1 && number <= 12) {
    return months[number - 1];
  } else {
    return "Invalid month number";
  }
};
