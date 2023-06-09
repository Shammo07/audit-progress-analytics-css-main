import { setCookie, getCookie } from "lib/cookie";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { logoutFunction } from "../api/auth";


export default function Logout() {
  const router = useRouter();
  const token = getCookie("REFRESH", null);
  logoutFunction(token.REFRESH).then((res) => {
    if (res.data.status === "success") {
      setCookie("JWT", null, {
        maxAge: "-1",
        path: "/",
      });
      setCookie("REFRESH", null, {
        maxAge: "-1",
        path: "/",
      });
   
      if (process.browser) router.push("/");
    }
  }).catch((err)=>{
      console.log(err)
  })

  return <></>;
}
