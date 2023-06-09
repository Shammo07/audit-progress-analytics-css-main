import { request } from "./request";
import { store } from "../redux/index";

export function submitCompanySetting(data) {
  console.log("🚀 ~ file: company.js:5 ~ submitCompanySetting ~ data", data)
  const states = store.getState();
  const url = "/company/editCompanySetting";
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: job.js ~ line 709 ~ returnnewPromise ~ err",
          err
        );
        return reject(err);
      });
  });
}

export function getCompanyName(){
  const states = store.getState();
  return states.companyName.companyName
}

export function getLogo(){
  const states = store.getState();
  return states.logo.logo
}
