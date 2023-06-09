import { request } from "./request";
import {store} from '../redux/index'
//require('dotenv').config();

export function getAnalytics(){
   const url = "/analytics/get";
   const states = store.getState();
      return new Promise((resolve, reject) => {
        request
          .get(url, {
            headers: {
              "Content-Type": "application/json",
             Authorization: "Bearer "+states.authentication.token
            },
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log("🚀 ~ file: analytics.js ~ line 22 ~ returnnewPromise ~ err", err)
            reject(err)});
      });
       
          
  }
