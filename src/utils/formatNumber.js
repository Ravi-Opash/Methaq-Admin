export const formatNumber = (number) => {
  return new Intl.NumberFormat("ar-AE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(number);
};
