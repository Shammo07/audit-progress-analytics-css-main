import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import {HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, REFRESH_TOKENS} from "@/lib/variables";
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
    const { refreshToken ,username} = await req.body;
    if(refreshToken===undefined||username===undefined)
    return res.status(HTTP_OK).json({ status: "success" });
    var catalogDB = await getCatalogConnection();
    const userDB = catalogDB.model("User", catalogUserSchema);
    const Tenant = catalogDB.model("tenant", catalogTenantSchema);
    const userData = await userDB
      .findOne({ username: username })
      .lean()
      .populate("tenant", "databaseName instanceUrl _id");
    const tenantObj = await getTenantConfig(userData);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    const refreshTokenDB = tenantDB.model("RefreshToken", refreshTokenSchema);
    const refreshTokenSession = await refreshTokenDB.startSession();

    await refreshTokenSession.withTransaction(() => {
      return refreshTokenDB.findOneAndDelete(
        { refreshToken: refreshToken },
        { session: refreshTokenSession }
      );
    });

    refreshTokenSession.endSession();

    const tokenIndex = REFRESH_TOKENS.indexOf(refreshToken);
    REFRESH_TOKENS.splice(tokenIndex, 1);
    return res.status(HTTP_OK).json({ status: "success" });

  } catch (error) {
    res
    .status(HTTP_INTERNAL_SERVER_ERROR)
    .json({ error: "Unknown server error" });
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
