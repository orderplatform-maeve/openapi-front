export const isDemo = process.env.SERVER_TYPE === 'demo';
export const isDev = process.env.NODE_ENV === 'development';

const getMatched = () => {
  try {
    const matched = location.pathname.match(/[v]{1}((\/\d+)+)/);

    return matched && matched.length > 0 ? matched[0] : 'version';
  } catch (error) {
    return '11';
  }
};

export const version = getMatched();
