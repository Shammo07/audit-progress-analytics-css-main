import React, { useState, useRef, useEffect } from "react";
import MemberPagesLayout from "../components/memberPagesLayout";
import { checkPermissionChange } from "@/lib/user";
import { useRouter } from "next/router";
import { getCookie } from "lib/cookie";
import { refreshOnServer } from "lib/auth";
import jsonwebtoken from "jsonwebtoken";
import Loading from "../components/loading";
import Head from "next/head";

export default function Welcome(props) {
  const router = useRouter();
  if (props.expire || props.permissionChange) {
    router.push("/logout");
  }

  return ( 
      <h2>Welcome</h2> 
  );
}

export async function getServerSideProps(context) {
  let expire = false;
  let permissionChange = false;
  let access_token;
  const jwt = getCookie("JWT", context.req);
  let user;
  try {
    user = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
  } catch (e) {
    access_token = refreshOnServer(context.req);

    if (access_token) {
      user = jsonwebtoken.verify(access_token, process.env.JWT_SECRET);
    } else if (access_token === undefined) {
      expire = true;
      user = null;
    }
  }

  if (user) permissionChange = await checkPermissionChange(user);

  return {
    props: {
      expire,
      permissionChange,
    }, // will be passed to the page component as props
  };
}

Welcome.getLayout = function getLayout(page) {
  const pageName = "";
  return (
    <>
      <MemberPagesLayout pageName={pageName}>{page}</MemberPagesLayout>
    </>
  );
};
