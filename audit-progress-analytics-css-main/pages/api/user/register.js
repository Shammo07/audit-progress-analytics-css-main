import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {getCatalogConnection} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import {HTTP_BAD_REQUEST, HTTP_OK, SALT_ROUNDS} from "@/lib/variables";
import {hash} from "bcrypt";


const apiRoute = nextConnect(getDefaultOptions());


apiRoute.post(async (req, res) => {
  try {
    var catalogDB = await getCatalogConnection();
    const User = catalogDB.model("User", catalogUserSchema);
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(HTTP_BAD_REQUEST).send("All input is required");
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("User already Exist. Please Login");
    }
    const encryptedPassword = await hash(password, SALT_ROUNDS);
    const user = await User.create({
      username,
      password: encryptedPassword,
    });
    res.status(HTTP_OK).json(user);
  } catch (error) {
    res
      .status(HTTP_BAD_REQUEST)
      .json({ error: "Please enter your email and password" });
  }finally {
    catalogDB.close(function () {
      console.log('Mongoose connection Catalog Connection closed');
    });
  }
})


export default apiRoute;

export const config = {
  api: {
    bodyParser: true
  },
};
