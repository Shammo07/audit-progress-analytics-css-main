import { request } from "./request";
import { store } from "../redux/index";

export async function getMailTemplate() {
  const states = store.getState();
  const url = "/mail/getAllMail";
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export async function getMailByName(name) {
  const states = store.getState();
  const url = "/mail/getMailByName"+'?name='+name;
  console.log(states.authentication.token);
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

export async function updateMailTemplate(mail) {
  const states = store.getState();
  const url = '/mail/updateMail';
  return new Promise((resolve, reject) => {
    request
      .patch(url, mail, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
    
};