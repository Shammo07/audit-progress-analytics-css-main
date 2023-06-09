import { request } from "./request";



export function alert() {
    //console.log(states.authentication.token)
    const url = "/corn/alert";
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }