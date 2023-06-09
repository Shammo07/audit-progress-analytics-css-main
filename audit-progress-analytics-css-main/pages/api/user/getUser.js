import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {getUser} from "@/lib/user";
import {verifyJWT} from "@/lib/auth";
import {HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_OK, HTTP_UNAUTHORIZED} from "@/lib/variables";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.get(verifyJWT,async (req, res) => {
  try {
    const person=await getUser(req.user)
    return res.status(HTTP_OK).json(person);
  } catch (error) {
    console.log(error);
    if (error.statusCode === HTTP_BAD_REQUEST)
      return res.status(HTTP_BAD_REQUEST).send({ error: "Can't find user" });

    if (error.statusCode === HTTP_UNAUTHORIZED) {
      console.log("No token found");
      return res.status(HTTP_UNAUTHORIZED).send({ error: "No token found" });
    }
    if (error.statusCode === HTTP_FORBIDDEN) {
      console.log("Token invalid or expired");
      return res
        .status(HTTP_FORBIDDEN)
        .send({ error: "Token invalid or expired" });
    }
  }
})


export default apiRoute;

export const config = {
  api: {
    bodyParser: true
  },
};
