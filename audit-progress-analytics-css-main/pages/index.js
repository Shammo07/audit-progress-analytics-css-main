import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Router from "next/router";
import { setCookie, getCookie } from "@/lib/cookie";
import { useDispatch } from "react-redux";
import { store } from "../redux";
import { styles } from "../public/jss/login.js";
import { createUseStyles } from "react-jss";
import {
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { ErrorMessage } from "@hookform/error-message";
import { authenticate, forgetPassword } from "../api/auth";
import { storeAccessToken, reauthenticate, storeUserRight ,storeUserName,storeCompanyName,storeLogo,storeSuperAdmin} from "lib/auth";
import LoadingBlock from "@/components/loadingBlock";
import Head from "next/head";

const useStyles = createUseStyles(styles);
export default function Index() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const reduxStates = store.getState();

  const [login, setLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forget, setForget] = useState(false);
  const [reset, setReset] = useState({ isOpen: false, message: "" });
  const [error, setError] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useForm({
    criteriaMode: "all",
    defaultValues: {
      forgetEmail: "",
      email: "",
      password: "",
      isRemember: [],
    },
  });

  const mobileForm = useForm()

  const handleForget = () => {
    setForget(true);
    setLogin(false);
  };

  const handleLogin = () => {
    setForget(false);
    setLogin(true);
  };

  //handle Error Snackbox close
  const handleClose = () => {
    setError(false);
    setReset({ isOpen: false });
  };
  const action = (
    <React.Fragment>
      <button className="submit-button w-button red" onClick={handleClose}>
        Close
      </button>
    </React.Fragment>
  );

  //handle login submit
  const onLoginSubmit = (data) => {
    setLoading(true)
    const email = data.email;
    const password = data.password;
    let isRemember = data.isRemember;
    if(isRemember.length>0) isRemember=true
    else isRemember=false

    const user = {
      username: email,
      password: password,
      isRemember: isRemember,
    };

    authenticate(user)
      .then((res) => {
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        const userRight = res.data.right;
        const username = res.data.username
        const companyName = res.data.companyName
        const logo = res.data.logo
        const isSuperAdmin = res.data.isSuperAdmin
        if (token) {
          if (isRemember) {
            setCookie("JWT", token, {
              maxAge: 1800,
              path: "/",
            });
            setCookie("REFRESH", refreshToken, {
              maxAge: 86400,
              path: "/",
            });
          } else {
            setCookie("JWT", token, {
              maxAge: 900,
              path: "/",
            });
            setCookie("REFRESH", refreshToken, {
              maxAge: 86400,
              path: "/",
            });
          }
          dispatch(storeAccessToken(token));
          dispatch(storeUserRight(userRight));
          dispatch(storeUserName(username));
          dispatch(storeCompanyName(companyName))
          dispatch(storeLogo(logo))
          dispatch(storeSuperAdmin(isSuperAdmin))  
          setLoading(false)
          Router.push("/welcome");
        }
      })
      .catch((err) => {
        console.log("🚀 ~ file: index.js:132 ~ onLoginSubmit ~ err", err)
        setLoading(false)
        setError(err);
      });
  };

  //handle forget password
  const onForgetSubmit = async (data) => {
    const user = { username: data.forgetEmail };
    setLoading(true)
    forgetPassword(user)
      .then((res) => {
        if (res.data.status === "success") {
          setLoading(false)
          setReset({ isOpen: true, message: res.data.message });
        }
      })
      .catch((err) => {
        setLoading(false)
        setError(err);
      });
  };

  useEffect(() => {
    if (reduxStates.authentication.token) {
      if (!isAuthenticated) setIsAuthenticated(true);
    } else {
      const token = getCookie("JWT");
      if (token) {
        dispatch(reauthenticate(token));
        if (!isAuthenticated) setIsAuthenticated(true);
      } else {
        if (loading) setLoading(false);
      }
    }
  });


  


  // const handleOpen =()=>setOpen(true);
  // const handleClose=()=>setOpen(false);
  return (
    <>
    <Head><title>Audit Job Progress and Auto Control System</title></Head>
      <div className={"mobileOnly"}>
      {loading && (<LoadingBlock/>)}
        <div className="form-header">
          <div className="text-block"> Audit Job Progress and Auto Control System</div>
        </div>
        {reset.isOpen === true && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>{reset.message}</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button color="primary" onClick={handleClose}>
                Close
              </button>
            </DialogActions>
          </Dialog>
        )}
        {error && (
          <Snackbar
            open={open}
            onClose={handleClose}
            message={error}
            action={action}
          />
        )}
        <div className="content login w-container">
          {forget && (
            <div className="form-block w-form">
              <form
                id="email-form"
                name="email-form"
                data-name="Email Form"
                className="form-content mobile"
                onSubmit={mobileForm.handleSubmit(onForgetSubmit)}
              >
                <div className="text-block-2">
                  <p>Please input your e-mail to reset your password</p>
                </div>
                <div className="form-row">
                <input
                    className="text-field w-input"
                    type="email"
                    {...mobileForm.register("forgetEmail", {
                      required: "This is required.",
                      maxLength: 256,
                    })}
                  />
                </div>
                <p className={classes.alertMessage}>
                      {errors.forgetEmail?.message}
                    </p>
                <div className="div-block-3">
                  <div></div>
                  <a
                    href="#"
                    className={classes.forgetPassword}
                    onClick={handleLogin}
                  >
                    Back to Login
                  </a>
                </div>
                <div className="login-form-btn">
                  <button type="submit" className="submit-button w-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
            {/*mobileOnly */}
          {login && (
            <div className="form-block w-form">
              <div className="formcontent mobile">
                <div className="text-block-2">Member Login</div>
                <div className="form-row">
                  <div className={"fullwidth"}>
                    <input
                      type="email"
                      className="text-field w-input"
                      name="email"
                      placeholder="Email"
                      {...mobileForm.register("email", {
                        required: "This is required",
                        maxLength: 256,
                      })}
                    />
                    <p className={classes.alertMessage}>
                      {errors.email?.message}
                    </p>
                  </div>
                </div>

                <div className="form-row">
                  <div className={"fullwidth"}>
                    <input
                      type="password"
                      className="text-field w-input"
                      name="password"
                      placeholder="Password"
                      {...mobileForm.register("password", {
                        required: "This is required.",
                        minLength: {
                          value: 8,
                          message: "Must more than 7 letters",
                        },
                        maxLength: 256,
                      })}
                    />
                    <p className={classes.alertMessage}>
                      {errors.password?.message}
                    </p>
                  </div>
                </div>

                <div className="div-block-3">
                  <label className="w-checkbox checkbox-field">
                    <input
                      type={"checkbox"}
                      id="checkbox"
                      name="isRemember"
                      className="w-checkbox-input"
                      {...mobileForm.register("isRemember")}
                    />
                    <span className="w-form-label" htmlFor="checkbox">
                      Remember Me?
                    </span>
                  </label>
                  <a
                    href="#"
                    className={classes.forgetPassword}
                    onClick={handleForget}
                  >
                    Forget Password?
                  </a>
                </div>
                <div className="login-form-btn">
                  <input
                    type="submit"
                    className="submit-button w-button green"
                    value="Login"
                    onClick={mobileForm.handleSubmit(onLoginSubmit)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={"monitorOnly"}>
      {loading && (<LoadingBlock/>)}
        {reset.isOpen === true && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>{reset.message}</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button color="primary" onClick={handleClose}>
                Close
              </button>
            </DialogActions>
          </Dialog>
        )}
        {error && (
          <Snackbar
            open={open}
            onClose={handleClose}
            message={error}
            action={action}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        )}
       
        <div className="content login w-container">
        
          <div className="div-block">
       
            <div className="form-header">
        
              <div className="text-block" > <img src="/img/Logo-2.jpg" width={100} height={50} style={{paddingRight: "19px"}} />    Audit Job Progress and Auto Control System</div>
            </div>

            {forget && (
              <form
                id="email-form"
                name="email-form"
                data-name="Email Form"
                className="formcontent"
                onSubmit={handleSubmit(onForgetSubmit)}
              >
                <div className="text-block-2">
                  <p>Please input your e-mail to reset your password</p>
                </div>
                <div className="form-row">
                  <input
                    className="text-field w-input"
                    type="email"
                    {...register("forgetEmail", {
                      required: "This is required.",
                      maxLength: 256,
                    })}
                  />
                </div>
                <p className={classes.alertMessage}>
                      {errors.forgetEmail?.message}
                    </p>
                <div className="div-block-3">
                  <div></div>
                  <a
                    href="#"
                    className={classes.forgetPassword}
                    onClick={handleLogin}
                  >
                    Back to Login
                  </a>
                </div>
                <div className="login-form-btn">
                  <button
                    type="submit"
                    data-wait="Please wait..."
                    className="submit-button w-button"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
              {/*monitor only */}
            {login && (
              <div className="form-block w-form">
                <form
                  className="formcontent"
                  onSubmit={handleSubmit(onLoginSubmit)}
                >
                  <div className="text-block-2">Member Login</div>
                  <div className="form-row">
                    <div className={"fullwidth"}>
                      <input
                        type="email"
                        className="text-field w-input"
                        name="email"
                        placeholder="Email"
                        {...register("email", {
                          required: "This is required",
                          maxLength: 256,
                        })}
                      />
                      <p className={classes.alertMessage}>
                        {errors.email?.message}
                      </p>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={"fullwidth"}>
                      <input
                        type="password"
                        className="text-field w-input"
                        name="password"
                        placeholder="Password"
                        {...register("password", {
                          required: "This is required.",
                          minLength: {
                            value: 8,
                            message: "Must more than 7 letters",
                          },
                          maxLength: 256,
                        })}
                      />
                      <p className={classes.alertMessage}>
                        {errors.password?.message}
                      </p>
                    </div>
                  </div>
                  <div className="div-block-3">
                    <label className="w-checkbox checkbox-field">
                      <input
                        type={"checkbox"}
                        id="checkbox"
                        name="isRemember"
                        className="w-checkbox-input"
                        {...register("isRemember")}
                      />
                      <span className="w-form-label" htmlFor="checkbox">
                        Remember Me?
                      </span>
                    </label>
                    <a
                      href="#"
                      // className={classes.forgetPassword}
                      onClick={handleForget}
                    >
                      Forget Password?
                    </a>
                  </div>
                  <div className="login-form-btn">
                    <input
                      type="submit"
                      className="submit-button w-button green"
                      value="Login"
                    />
                  </div>
                </form>
              </div>
            )}
        
          </div>      
        </div>
      </div>
    </>
  );
}
