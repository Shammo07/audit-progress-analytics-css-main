import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {getCatalogConnection} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import {HTTP_BAD_REQUEST, SALT_ROUNDS} from "@/lib/variables";
import {hash} from "bcrypt";


const apiRoute = nextConnect(getDefaultOptions());


apiRoute.post(async (req, res) => {
  try {
    var catalogDB = await getCatalogConnection();
    const User = catalogDB.model("User", catalogUserSchema);
    const { id, newPassword } = req.body;
    const encryptedPassword = await hash(newPassword, SALT_ROUNDS);
    await new Promise((resolve, reject)=>{
      User.findByIdAndUpdate(
        { _id: id },
        { password: encryptedPassword },
        function (err, data) {
          if (err) {
            reject({ statusCode: HTTP_BAD_REQUEST })
            //return res.json({ status: "error", error: "Database Error" });
          } else if (data) {
            resolve()
          }
        }
      );
    })

    res.json({
      status: "success",
      message: "Reset password success",
    });
  } catch (error) {
    if (error.statusCode === HTTP_BAD_REQUEST)
      return res.status(error.statusCode).json({ error: "Database Error" });
  }finally {
    catalogDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
})


export default apiRoute;

export const config = {
  api: {
    bodyParser: true
  },
};
