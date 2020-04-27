const wonComma = (num) => {
  const re = /\B(?=(\d{3})+(?!\d))/g;
  const newNum = num.replace(re, ',');
  const result = `${newNum}`;

  return result;
};

export const won = (num) => {
  const isNum = typeof num === 'number';

  if (isNum) return wonComma(num.toString());

  return wonComma(num);
};
