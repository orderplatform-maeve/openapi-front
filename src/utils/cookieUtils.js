/* 쿠키를 설정 합니다.
 document.cookie = `accessToken=${response.data.token.accessToken}`;
 */
export const setCookie = (name, value, minutes) => {
  let expires = '';

  if (minutes) {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 1000 * 60));
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${value || ''}${expires}; path=/; sameSite=Lax;`;
};

// 쿠키를 불러 옵니다.
export const getCookie = (name) => {
  const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return value ? value[2] : '';
};

// 쿠키를 제거 합니다.
export const deleteCookie = (name) => {
  const date = new Date();
  date.setDate(date.getDate() - 100);

  const cookie = `${name}=;Expires=${date.toUTCString()}`;
  document.cookie = cookie;
};
