export const formattedDateUfc = (value) => {
  const inputDate = new Date(value);
  const offset = inputDate.getTimezoneOffset() * 60000;
  const utcTime = inputDate.getTime() - offset;
  const formattedDate = new Date(utcTime).toISOString();

  return formattedDate;
};
