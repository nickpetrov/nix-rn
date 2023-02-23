export const replaceRegexForNumber = (newValue: string) => {
  const val = newValue
    .replace(/,/g, '.')
    .replace(/[^0-9\.]/g, '')
    .replace(/^([^.]*\.)(.*)$/, (a, b, c) => {
      return b + c.replace(/\./g, '');
    });

  return val;
};
