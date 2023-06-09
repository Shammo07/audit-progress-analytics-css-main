// import bcrypt from 'bcrypt';
import Router from "next/router";

const saltRounds = 10;

import { store } from "../redux";
import { AUTHENTICATE, DEAUTHENTICATE, SAVE_USER_RIGHT,SAVE_USER_NAME,SAVE_COMPANY_NAME,SAVE_LOGO,SAVE_SUPER_ADMIN } from "../redux/types";
import { getCookie, setCookie, removeCookie } from "./cookie";
import { request } from "@/api/request";
import {HTTP_FORBIDDEN, HTTP_UNAUTHORIZED} from "@/lib/variables";
import {getCatalogConnection} from "./db";
import catalogUserSchema from "../models/User";
import jsonwebtoken, {sign, verify} from "jsonwebtoken"

/*export async function hashPassword(password){
  try{
    let hash = await bcrypt.hash(password, saltRounds)
  }catch (e){
    console.error(e)
    return "Failed to hash password"
  }
}*/

export const storeAccessToken = (data) => (dispatch) => {
  dispatch({ type: AUTHENTICATE, payload: data });
};

export const storeUserRight = (data) => (dispatch) => {
  dispatch({ type: SAVE_USER_RIGHT, payload: data });
};

export const storeUserName = (data) => (dispatch)=>{
  dispatch({type:SAVE_USER_NAME,payload:data})
}

export const storeCompanyName = (data) => (dispatch)=>{
  dispatch({type:SAVE_COMPANY_NAME,payload:data})
}

export const storeLogo = (data) => (dispatch)=>{
  dispatch({type:SAVE_LOGO,payload:data})
}

export const storeSuperAdmin= (data) => (dispatch)=>{
  dispatch({type:SAVE_SUPER_ADMIN,payload:data})
}

export async function removeUserData() {}

// gets the token from the cookie and saves it in the store
export const reauthenticate = (token) => (dispatch) => {
  dispatch({ type: AUTHENTICATE, payload: token });
};

// removing the token
export function deauthenticate() {
  return (dispatch) => {
    removeCookie("JWT");
    Router.push("/");
    dispatch({ type: DEAUTHENTICATE });
  };
}

export async function restoreServerLoginStatus(req, store) {
  if (req.headers.cookie) {
    store.dispatch(reauthenticate(getCookie("token", req)));
  }
}

export async function restoreLoginStatus() {
  const states = store.getState();

  if (!states.authentication.token) {
    const jwt = getCookie("JWT");
    store.dispatch(reauthenticate(jwt));
  }
}

/* export  function refreshAccessToken(){
  //const dispatch=useDispatch()
  const token = getCookie("REFRESH", null);
  refresh(token.REFRESH)
  .then((res)=>{
    console.log(res)
    if(res.data.token !=""|| res.data.token!=undefined || res.data.token!=null){
      setCookie("JWT", res.data.token, {
        maxAge: 3000000,
      });
     // dispatch(storeUserData(res.data.token))
    }
  }).catch((err)=>{
      console.log(err)
  })
} */

export function refreshAccessToken(refreshToken,refreshSecret,jwtSecret) {
  const user = verify(refreshToken,refreshSecret)

  const accessToken = sign(
    {
      userRight:user.userRight,
      catalogUserId:user.catalogUserId,
      id: user.id,
      username: user.username,
      tenantId: user.tenantId
    },
    jwtSecret,

    {
      algorithm: "HS256",
      expiresIn: "10s",
    }
  )

  return accessToken
}

export function refreshAccessTokenFromServer() {
  const token = getCookie("REFRESH", null);
  //console.log(token)
  const refreshToken = token.REFRESH;
  //console.log(refreshToken)
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
        //console.log(res)
        setCookie("JWT", res.data.token, {
          maxAge: 3000000,
        });
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export async function refreshAccessTokenGetServerSideProps(req) {
  const token = getCookie("REFRESH", req);
  const refreshToken = token;
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

//refresh token
export async function refresh() {
  const states = store.getState();
  const getTokenCookie = getCookie("REFRESH")
  const token = getTokenCookie.REFRESH
  let saveToken = true;
  await refreshAccessTokenFromServer()
    .then((res) => {
      const access_token = res.data.token;
      store.dispatch(storeAccessToken(access_token));
    })
    .catch((err) => {
      saveToken = false;
    });
  return saveToken;
}

export async function handleRefresh(retryCallback) {
  if (await refresh()) {

    retryCallback();

  } else {
    window.location.href = "/logout";
  }
}

export async function verifyJWT(req,res,next) {
  let token;
  const authorization=req.headers["authorization"]||req.headers["Authorization"]||undefined

  if(!authorization) throw { statusCode: HTTP_UNAUTHORIZED,message: "Invalid authorization"}
  token = authorization.split(" ")[1]

  if(token){
    try{
      req.user= jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if(next) next()
    }catch (e) {
      console.log(e)
      if(e.name=="TokenExpiredError")
        return res.status(HTTP_UNAUTHORIZED).json({error: "Time Out"})

      if(e.name=="jwt malformed")
        return res.status(HTTP_FORBIDDEN).json({error: "Token Invaild"})
    }
  }else{
    return  res.status(HTTP_UNAUTHORIZED).json({error:"Unauthorized"})
  }
}

export async function fetchUserByToken(req){
  const catalogDB = await getCatalogConnection()

  const token = req.header("authorization").split(" ")[1]
  const User = catalogDB.model("User",catalogUserSchema)
  return new Promise((resolve, reject) => {
    if (req.headers && token) {
      let authorization = token;
      let decoded;
      try {
        decoded = jsonwebtoken.verify(authorization, process.env.JWT_SECRET);
      } catch (e) {
        catalogDB.close(function () {
          console.log('Mongoose connection Catalog Connection closed');
        });
        console.log("Token expire");
        throw { statusCode: HTTP_FORBIDDEN }
        //  return;
      }
      let username = decoded.username;
      User.findOne({ username })
        .then((user) => {
          catalogDB.close(function () {
            console.log('Mongoose connection Catalog Connection closed');
          });
          resolve(user);
        })
        .catch((err) => {
          catalogDB.close(function () {
            console.log('Mongoose connection Catalog Connection closed');
          });
          console.log("Token error")
          throw { statusCode: HTTP_FORBIDDEN }
        });
    } else {
      catalogDB.close(function () {
        console.log('Mongoose connection Catalog Connection closed');
      });
      console.log("No token found")
      throw { statusCode: HTTP_UNAUTHORIZED }
    }
  });
}

export function refreshOnServer(req) {
  let data;
  try {
    const refreshToken = getCookie("REFRESH", req);

    data = refreshAccessToken(refreshToken,process.env.REFRESH_SECRET,process.env.JWT_SECRET);
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
