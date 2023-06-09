import { request } from "./request";
import {getCookie, setCookie} from "@/lib/cookie";
import { store } from "../redux/index";
//require('dotenv').config();


export function authenticate(user) {
  const url = "/user/login";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("🚀 ~ file: auth.js ~ line 19 ~ returnnewPromise ~ err", err)
        reject(err.response.data.error)
      });
  });
}

export function forgetPassword(user) {
  const url = "/user/forgetPassword";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err.response.data.error));
  });
}

export function resetPassword(user) {
  const url = "/user/resetPassword";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err.response.data.error));
  });
}

export function logoutFunction(refreshToken) {
  const url = "/user/logout";
  const states = store.getState()
  const username = states.userName.username
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { refreshToken ,username},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err.response.data.error));
  });
}

/* export async function refresh(refreshToken) {
  const url = "/user/refresh";

  return new Promise((resolve, reject) => {

    request
      .post(
        url,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res)
        resolve(res);
      })
      .catch((err) => reject(err.response.data.error))

  });

} */
export async function refreshAccessToken() {
  const token = getCookie("REFRESH", null);
  const refreshToken = token.REFRESH;
  return new Promise((resolve, reject) => {
    request
      .post(
        "/user/refresh",
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setCookie("JWT", res.data.token, {
          maxAge: 3000000,
        });
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
