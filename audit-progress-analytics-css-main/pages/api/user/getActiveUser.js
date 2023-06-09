import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {verifyJWT} from "@/lib/auth";
import {HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK} from "@/lib/variables";
import { getActiveUser } from "@/lib/user";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.get(verifyJWT,async (req, res) => {
  try {
    const userArray=await getActiveUser(req.user)
    return res.status(HTTP_OK).json(userArray);
  } catch (error) {
    if (error.statusCode === HTTP_FORBIDDEN)
      return res.status(HTTP_FORBIDDEN).json({ error: "You don't have right!" });
    if (error.statusCode === HTTP_INTERNAL_SERVER_ERROR)
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .send({ error: "Error Occurred" });
  }
})

export default apiRoute;

export const config = {
  api: {
    bodyParser: true
  },
};
