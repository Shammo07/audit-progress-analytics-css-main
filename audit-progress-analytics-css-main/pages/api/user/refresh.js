import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import {
  HTTP_FORBIDDEN,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  REFRESH_TOKENS,
} from "@/lib/variables";
import jwt from "jsonwebtoken"
import { refreshAccessToken } from "@/lib/auth";
import catalogUserSchema from "@/models/User";
import catalogTenantSchema from "@/models/Tenant";
import refreshTokenSchema from "@/models/Tenant/RefreshToken";
import {
  getCatalogConnection,
  getTenantConfig,
  getTenantConnection,
} from "@/lib/db";

const apiRoute = nextConnect(getDefaultOptions());
apiRoute.post(async (req, res) => {
  try {
    var catalogDB = await getCatalogConnection();

    const { refreshToken } = req.body;
    let accessToken;
    if (refreshToken === "") throw { statusCode: HTTP_UNAUTHORIZED };
    const refreshSecret =  process.env.REFRESH_SECRET
    const jwtSecret = process.env.JWT_SECRET
    const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);


    const userDB = catalogDB.model("User", catalogUserSchema);
    const Tenant = catalogDB.model("tenant", catalogTenantSchema);

    const userData = await userDB
      .findOne({ username: user.username })
      .lean()
      .populate("tenant", "databaseName instanceUrl _id");

    const tenantObj = await getTenantConfig(userData);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    const refreshTokenDB = tenantDB.model("RefreshToken", refreshTokenSchema);
    console.log("🚀 ~ file: refresh.js ~ line 50 ~ apiRoute.post ~ REFRESH_TOKENS", REFRESH_TOKENS)
    if (!REFRESH_TOKENS.includes(refreshToken)) {

      const refreshTokenFromDB = await refreshTokenDB.findOne({
        refreshToken: refreshToken,
      });
      if (refreshTokenFromDB) {
        accessToken =  refreshAccessToken(refreshTokenFromDB.refreshToken,refreshSecret,jwtSecret);
      } else {
        throw { statusCode: HTTP_FORBIDDEN };
      }
    } else {
      accessToken =  refreshAccessToken(refreshToken,refreshSecret,jwtSecret);
    }

    return res.status(HTTP_OK).json({ token: accessToken });
  } catch (error) {
    console.error(error);
    if (error.name == "TokenExpiredError")
      return res.status(HTTP_UNAUTHORIZED).json({ error: "Time Out" });

    if (error.statusCode === HTTP_UNAUTHORIZED)
      return res.status(error.statusCode).json({ error: "Invalid Token" });

    if (error.statusCode === HTTP_FORBIDDEN)
      return res
        .status(error.statusCode)
        .json({ error: "You don't have right" });
  }finally {
    catalogDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: true,
  },
};
