const wonComma = (num) => {
  const re = /\B(?=(\d{3})+(?!\d))/g;
  const newNum = num.replace(re, ',');
  const result = `${newNum}원`;

  return result;
};

export const won = (num) => {
  const isNum = typeof num === 'number';

  if (isNum) return wonComma(num);

  return wonComma(num.toString());
};
