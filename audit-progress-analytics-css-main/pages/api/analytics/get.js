import nextConnect from "next-connect";
import getDefaultOptions from "next-connect";
import data from "../../../data.json";
import teamSchema from "@/models/Tenant/Team";
import { verifyJWT } from "@/lib/auth";
import { getAllJobForAnalytics } from "@/lib/job";
import {
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR, HTTP_OK,
  TENANTS,
} from "@/lib/variables";
 const apiRoute = nextConnect(getDefaultOptions());

 apiRoute.get(verifyJWT, async (req, res) => {

 try {
/*   if(req.method === "GET"){
    res.status(200).json(data);
   } */
    const jobsArray = await getAllJobForAnalytics(req.user)
     return res.status(HTTP_OK).json(jobsArray); 
  } catch (error) {
    if (error.statusCode === HTTP_FORBIDDEN)
       return res
        .status(HTTP_FORBIDDEN)
        .json({ error: "You don't have right!" });
     if (error.statusCode === HTTP_INTERNAL_SERVER_ERROR)
       return res
         .status(HTTP_INTERNAL_SERVER_ERROR)
         .send({ error: "Error Occurred" });
   }

   // return res.status(200).json(data);
 })


 export default apiRoute;

/* export default async function handler(req, res) {
  if(req.method === "GET"){
   res.status(200).json(data);
  }
} */


export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
