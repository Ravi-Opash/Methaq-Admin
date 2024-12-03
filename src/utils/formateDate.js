export const formatDate = (date) => {
  const day = date.split(/[-/]+/);
  if(day[1].match(/[a-zA-Z]/)){
    return `${day[0]}-${day[1]}-${day[2]}`;
  }
  return `${day[2]}-${day[1]}-${day[0]}`;
};
