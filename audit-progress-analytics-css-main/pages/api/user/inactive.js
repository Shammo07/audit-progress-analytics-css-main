import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {verifyJWT} from "@/lib/auth";
import {HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, TENANTS} from "@/lib/variables";
import {getCatalogConnection, getTenantConfig, getTenantConnection} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.post(verifyJWT,async (req, res) => {
  const { username } = req.body;
  let reqUserName = req.user.username

  const tenantObj =await getTenantConfig(req.user)
  var catalogDB = await getCatalogConnection();
  var tenantDB = await getTenantConnection(
    tenantObj.databaseName,
    tenantObj.instanceUrl
  );
  const catalogSession = await catalogDB.startSession();
  const tenantSession = await tenantDB.startSession();

  try {
    const catalogUser = catalogDB.model("User", catalogUserSchema);
    const tenantUser = tenantDB.model("User", tenantUserSchema);
    const checkUserRight = await tenantUser.findOne({ username: reqUserName })

    if (checkUserRight.right[0].accessUserMgmt === false)
      throw { statusCode: HTTP_FORBIDDEN };
    await catalogSession.withTransaction(() => {
      return catalogUser.findOneAndUpdate(
        { username },
        {isActive: "Inactive"},
        { session: catalogSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantUser.findOneAndUpdate(
        { username },
        {isActive: "Inactive"},
        { session: tenantSession }
      );
    });
    catalogSession.endSession();
    tenantSession.endSession();
    res.status(200).json({
      status: "success",
      message: username + "  has been inactivated",
    });
  } catch (error) {
    console.error(error);
    if (error.statusCode === HTTP_FORBIDDEN) {
      return res.status(HTTP_FORBIDDEN).json({ error: "You don't have right!" });
    } else {
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ error: "Unknown server error" });
    }
  }finally {
    catalogDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
    tenantDB.close(function () {
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
