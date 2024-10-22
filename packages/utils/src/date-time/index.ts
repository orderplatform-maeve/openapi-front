import { format } from 'date-fns';

const getFormattedString: typeof format = (...args) => {
  return format(...args);
};

export { getFormattedString };
