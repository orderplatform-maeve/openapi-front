export const isDemo = process.env.SERVER_TYPE === 'demo';
// export const isDev = process.env.NODE_ENV === 'development';
export const isDev = process.env.STOP_REDIRECT;
export const STOP_REDIRECT = process.env.STOP_REDIRECT;
export const IS_DEV_TEAM = process.env.IS_DEV_TEAM;
export const IS_LG_FLAG = process.env.IS_LG_FLAG;


const getMatched = () => {
  try {
    const matched = location.pathname.match(/[v]{1}((\/\d+)+)/);

    return matched && matched.length > 0 ? matched[0] : 'version';
  } catch (error) {
    return '11';
  }
};

export const version = getMatched();
