import React from "react";
import Router from "next/router";

/* export default function _error() {
  React.useEffect(() => {
    Router.push("/");
  });

  return <div />;
}
 */

function Error({ statusCode }) {

  if(statusCode==403){
    Router.push('/403')
  }
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
