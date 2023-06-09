import {HTTP_METHOD_NOT_ALLOWED} from "./variables";


export function getDefaultOptions(){
  return {
    onError(error, req, res) {
      console.log(error);
      console.log(error);
      res.status(res.statusCode).json({ error: `Sorry something Happened! ${error.message}` });
    },
    // Handle any other HTTP method
    onNoMatch(req, res) {
      res.status(HTTP_METHOD_NOT_ALLOWED).json({ error: `Method '${req.method}' Not Allowed` });
    },
  }
}
