export const isDemo = process.env.SERVER_TYPE === 'demo';
export const isDev = process.env.NODE_ENV === 'development';

const matched = location.pathname.match(/[v]{1}((\/\d+)+)/);
export const version = matched && matched.length > 0 ? matched[0] : 'version';
