  export const TimeFromNow = (date) => {
  const diff = Math.abs(Date.now() - new Date(date));
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return `${years} year ago`;
  } else if (months > 0) {
    return `${months} month ago`;
  } else if (weeks > 0) {
    return `${weeks} week ago`;
  } else if (days > 0) {
    return `${days} day ago`;
  } else if (hours > 0) {
    return `${hours} hour ago`;
  } else if (minutes > 0) {
    return `${minutes} min ago`;
  } else {
    return `Just now`;
  }
};
