import { isDev } from '@utils/constants';

const COOKIE_AUTH_NAME = 'auth';

export const COOKIE_DOMAIN = isDev ? 'torder.co.kr' : null;

export default COOKIE_AUTH_NAME;
