export const formatFCFA = (value, decimals = 0) => {
  const number = Number(value ?? 0);
  const safe = Number.isFinite(number) ? number : 0;
  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatter.format(safe)} F CFA`;
};
