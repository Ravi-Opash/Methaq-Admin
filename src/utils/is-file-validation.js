export const isValidFile = (file) => {
  if (!file) {
    return false;
  }
  if ("File" in window && file instanceof File) return true;
  else return false;
};
