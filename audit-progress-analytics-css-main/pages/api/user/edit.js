import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  SALT_ROUNDS,
} from "@/lib/variables";
import {
  getCatalogConnection,
  getTenantConfig,
  getTenantConnection,
} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";
import { verifyJWT } from "@/lib/auth";
import bcrypt from "bcrypt"

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.post(verifyJWT, async (req, res) => {
  try {
    let {
      id,
      name,
      username,
      password,
      initial,
      isActive,
      accessUserMgmt,
      canViewAllJob,
      canViewJobList,
      canViewOwnJob,
      canViewOwnJobForTeamMember,
      canSetJob,
      canViewReport,
      canEditReport,
      canEditBiWeeklyTimeSheet,
      canEditEmailTemplate
    } = req.body;
    console.log("🚀 ~ file: edit.js ~ line 39 ~ apiRoute.post ~ canEditEmailTemplate", canEditEmailTemplate)
    let reqUserName = req.user.username;
    let existingUser;
    let existingUserInitial;

    const tenantObj = await getTenantConfig(req.user);
    var catalogDB = await getCatalogConnection();
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );
    const catalogSession = await catalogDB.startSession();
    const tenantSession = await tenantDB.startSession();
    const catalogUser = catalogDB.model("User", catalogUserSchema);
    const tenantUser = tenantDB.model("User", tenantUserSchema);
    const getTenantUser = await tenantUser.findById({ _id: id });

    if(!(username===getTenantUser.username))  
     existingUser = await catalogUser.findOne({ username });

     if(!(initial===getTenantUser.initial))
     existingUserInitial = await tenantUser.findOne({ initial });

    const checkUserRight = await tenantUser.findOne({ username: reqUserName });

    if (checkUserRight.right[0].accessUserMgmt === false)
      throw { statusCode: HTTP_FORBIDDEN };

    if (existingUserInitial || existingUser) {
      throw { statusCode: HTTP_BAD_REQUEST };
    }

    
    const getUserName = getTenantUser.username;
    const getCatalogUser = await catalogUser.findOne({ username: getUserName });

    if (username === "") username = getUserName;

    if (name === "") name = getTenantUser.name;

    if (password === "" || password==="*123*456") {
      password = getCatalogUser.password;
    } else {
      password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    if (initial === "") initial = getTenantUser.initial;


    await catalogSession.withTransaction(() => {
      return catalogUser.findOneAndUpdate(
        { username: getUserName },

        {
          username: username,
          password: password,
          isActive: isActive,
        },

        { session: catalogSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantUser.findByIdAndUpdate(
        { _id: id },

        {
          username: username,
          name: name,
          initial: initial,
          isActive: isActive,
          right: {
            accessUserMgmt: accessUserMgmt,
            canViewAllJob: canViewAllJob,
            canViewJobList: canViewJobList,
            canViewOwnJob: canViewOwnJob,
            canViewOwnJobForTeamMember:canViewOwnJobForTeamMember,
            canSetJob: canSetJob,
            canViewReport: canViewReport,
            canEditReport: canEditReport,
            canEditBiWeeklyTimeSheet: canEditBiWeeklyTimeSheet,
            canEditEmailTemplate:canEditEmailTemplate,
          },
        },

        { session: catalogSession }
      );
    });
    catalogSession.endSession();
    tenantSession.endSession();

    res
    .status(200)
    .json({ status: "success", message: "Edit User success" });

  } catch (error) {
    console.log(error);

    if (error.statusCode === HTTP_BAD_REQUEST) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: "Initial or Email already exist" });
    } else if (error.statusCode === HTTP_FORBIDDEN) {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ error: "You don't have right!" });
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
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: true,
  },
};
