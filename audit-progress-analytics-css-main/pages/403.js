import { createUseStyles } from "react-jss";
import { styles } from "../public/jss/forbiddenStyle";
import { useRouter } from "next/router";
import Error from "next/error";
export default function Custom403() {
  const useStyles = createUseStyles(styles);
  const classes = useStyles();
  const router = useRouter();

/*   const handleLogout = () => {
    router.push("/logout");
  }; */

  return (
    <>
      <div className="content login w-container">
        <div className="form-block w-form">
          <div className={classes.textBlock}>
            <h1>403</h1>
          </div>
          <div className={classes.textBlock}>
            <h3>You do not have permission to access!</h3>
          </div>
          <div className="login-form-btn">
            <button
              className="submit-button w-button red"
              onClick={() =>  window.location.href = "/logout"}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
