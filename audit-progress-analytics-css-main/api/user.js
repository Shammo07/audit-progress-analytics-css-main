import { request } from "./request";
import { store } from "../redux/index";


export function createUser(user) {
  const states = store.getState();
  const url = "/user/create";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function getAllUser() {
  const states = store.getState();
  //console.log(states.authentication.token)
  const url = "/user/getAllUser";
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
}

export function getAllUserProps(token) {
  const url = "/user/getAllUser";
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) =>{
        //console.log(err)
        reject(err)});
  });
}

export function getActiveUserProps(token) {
  const url = "/user/getActiveUser";
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) =>{ 
        //console.log(err)
        reject(err)});
  });
}

export function createTenant(user){
  const url = "/user/createTenant";
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
        reject(err);
      });
  });
}

/* export function deleteUser(user) {
  const states = store.getState();
  const url = "/user/delete";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
} */

export function inactiveUser(user) {
  const states = store.getState();
  const url = "/user/inactive";
  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}


export function getUserRight(token) {
  const url = "/user/getUser";
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getUser() {
  const states = store.getState();
  return states.userRight.right
}

export function getSuperAdmin(){
  const states = store.getState();
  return states.isSuperAdmin.isSuperAdmin
}



export function editUser(user) {
  const states = store.getState();
  const url = "/user/edit";

  return new Promise((resolve, reject) => {
    request
      .post(url, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}


export function massCreate(file){
  const states = store.getState();
  const url = "/user/batchUpload"
  return new Promise((resolve, reject) => {
    request
      .post(url, file, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
        body: JSON.stringify({
          csv: file?.data,
        }),
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });

}
