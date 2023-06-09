import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Router from "next/router";
import { useRouter } from "next/router";

import { styles } from "../../public/jss/login.js";
import { createUseStyles } from 'react-jss'
import {
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { ErrorMessage } from "@hookform/error-message";
import { resetPassword } from "../../api/auth";
import LoadingBlock from "@/components/loadingBlock";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { id } = router.query;
  const useStyles = createUseStyles(styles);
  const classes = useStyles();

  const [error, setError] = useState(false);
  const [toLogin, setToLogin] = useState({ isOpen: false, message: "" });
  const [loading,setLoading] = useState(false);

  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors },
    control,
  } = useForm({
    criteriaMode: "all",

    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleClose = () => {
    setError(false);
  };

  const backToLogin = () => {
    Router.replace("/");
  };

  const action = (
    <React.Fragment>
      <button className="submit-button w-button" onClick={handleClose}>
        Close
      </button>
    </React.Fragment>
  );

  //handle reset password
  const onResetSubmit = async (data) => {
    setLoading(true)
    var user = { id: id, newPassword: data.confirmPassword };

    resetPassword(user)
      .then((res) => {
        if (res.data.status == "success") {
          setLoading(false)
          setToLogin({ isOpen: true, message: res.data.message });
        }
      })
      .catch((err) => {
        setLoading(false)
        setError(err);
      });
  };

  return (
    <>
      <div className={"mobileOnly"}>
      {loading && (<LoadingBlock/>)}
        <div className="form-header">
          <div className="text-block">Job Progress Management System</div>
        </div>
        {toLogin.isOpen == true && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>{toLogin.message}</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button className="submit-button w-button" onClick={backToLogin}>
                Back to Login
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
          <div className="form-block w-form">
            <form
              id="email-form"
              name="email-form"
              data-name="Email Form"
              className="form-content mobile"
              onSubmit={handleSubmit(onResetSubmit)}
            >
              <div className="text-block-2">Reset Password</div>
              <label htmlFor="name">New Password</label>
              <div className="form-row">
                <input
                  className="text-field w-input"
                  type="password"
                  {...register("newPassword", {
                    required: "This is required.",
                    minLength: {
                      value: 8,
                      message: "Must more than 7 letters",
                    },
                    maxLength: 256,
                  })}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="newPassword"
                render={({ message }) => (
                  <p className={classes.alertMessage}>{message}</p>
                )}
              />

               <label htmlFor="name">Confirm Password</label>
              <div className="form-row">

                <input
                  className="text-field w-input"
                  type="password"
                  {...register("confirmPassword", {
                    required: "This is required.",
                    minLength: {
                      value: 8,
                      message: "Must more than 7 letters",
                    },
                    maxLength: 256,
                  })}
                />
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
              <ErrorMessage
                errors={errors}
                name="confirmPassword"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p className={classes.alertMessage} key={type}>
                      {message}
                    </p>
                  ))
                }
              />
            </form>
          </div>
        </div>
      </div>
      <div className={"monitorOnly"}>
      {loading && (<LoadingBlock/>)}
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
              <div className="text-block">Job Progress Management System</div>
            </div>
            <div className="form-block w-form">
              <form
                id="email-form"
                name="email-form"
                data-name="Email Form"
                className="form-content"
                onSubmit={handleSubmit(onResetSubmit)}
              >
                <div className="text-block-2">Reset Password</div>
                <label htmlFor="name">New Password</label>
                <div className="form-row">
                  <input
                    className="text-field w-input"
                    type="password"
                    {...register("newPassword", {
                      required: "This is required.",
                      minLength: {
                        value: 8,
                        message: "Must more than 7 letters",
                      },
                      maxLength: 256,
                    })}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="newPassword"
                  render={({ message }) => (
                    <p className={classes.alertMessage}>{message}</p>
                  )}
                />
                           <label htmlFor="name">Confirm Password</label>
                <div className="form-row">
                  <input
                    className="text-field w-input"
                    type="password"
                    {...register("confirmPassword", {
                      required: "This is required.",
                      minLength: {
                        value: 8,
                        message: "Must more than 7 letters",
                      },
                      maxLength: 256,
                    })}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
                  render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                      <p className={classes.alertMessage} key={type}>
                        {message}
                      </p>
                    ))
                  }
                />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
