// import cookie from 'js-cookie';
// import { parseCookies, setCookie, destroyCookie } from "nookies";
import cookie from "nookies";

export const setCookie = (key, value,option,ctx) => {
  if (process.browser) {
    cookie.set(null, key, value, option);
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.destroy(null,key);
  }
};

/**
 * @param key
 * @param req
 * @returns {*}
 */
export const getCookie = (key, req) => {
  return !req
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};


const getCookieFromBrowser = key => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};
