export const formateWithoutDasimal = (number) => {
  return new Intl.NumberFormat("ar-AE", {
    maximumFractionDigits: 2,
  }).format(number);
};
