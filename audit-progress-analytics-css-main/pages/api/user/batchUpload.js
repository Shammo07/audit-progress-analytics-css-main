import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import { verifyJWT } from "@/lib/auth";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  SALT_ROUNDS,
  TENANTS,
} from "@/lib/variables";
import {
  getCatalogConnection,
  getTenantConfig,
  getTenantConnection,
} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";
import mailSchema from "@/models/Tenant/Email";
import {
  getEmailConnection,
  getNodemailerConfig,
  getTestMessageUrl,
} from "@/lib/email";
import bcrypt from "bcrypt";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.post(verifyJWT, async (req, res) => {
  try {
    let reqUserName = req.user.username;
    let data = [];
    let noOfSuccess = 0;
    let noOfFail = 0;

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

    const checkUserRight = await tenantUser.findOne({ username: reqUserName });

    if (checkUserRight.right[0].accessUserMgmt === false)
      throw { statusCode: HTTP_FORBIDDEN };

    if (req.body[0][0] === "") throw { statusCode: HTTP_BAD_REQUEST };

    for (let i = 0; i < req.body.length; i++) {
      let reformData = {};
      if (req.body[i][0] != "") {
        reformData = {
          name: req.body[i][0],
          username: req.body[i][1],
          password: req.body[i][2],
          initial: req.body[i][3],
          accessUserMgmt: req.body[i][4],
          canEditEmailTemplate: req.body[i][5],
          canViewAllJob: req.body[i][6],
          canViewJobList: req.body[i][7],
          canSetJob: req.body[i][8],
          canViewOwnJob: req.body[i][9],
          canViewOwnJobForTeamMember: req.body[i][10],
          canViewReport: req.body[i][11],
          canEditReport: req.body[i][12],
          canEditBiWeeklyTimeSheet: req.body[i][13],
        };
        data.push(reformData);
      }
    }
    console.log(
      "🚀 ~ file: batchUpload.js ~ line 83 ~ apiRoute.post ~ data",
      data
    );
    for (let i = 0; i < data.length; i++) {
      let accessUserMgmt = false;
      let canEditEmailTemplate = false;
      let canViewAllJob = false;
      let canViewJobList = false;
      let canSetJob = false;
      let canViewOwnJob = false;
      let canViewOwnJobForTeamMember = false;
      let canViewReport = false;
      let canEditReport = false;
      let canEditBiWeeklyTimeSheet = false;
      let name;
      let username;
      let password;
      let initial;
      if (data[i] != {}) {
        name = data[i].name;
        username = data[i].username;
        password = data[i].password;
        initial = data[i].initial;
        accessUserMgmt = data[i].accessUserMgmt === "Y" ? true : false;
        canEditEmailTemplate =
          data[i].canEditEmailTemplate === "Y" ? true : false;
        canViewAllJob = data[i].canViewAllJob === "Y" ? true : false;
        canViewJobList = data[i].canViewJobList === "Y" ? true : false;
        canSetJob = data[i].canSetJob === "Y" ? true : false;
        canViewOwnJob = data[i].canViewOwnJob === "Y" ? true : false;
        canViewOwnJobForTeamMember =
          data[i].canViewOwnJobForTeamMember === "Y" ? true : false;
        canViewReport = data[i].canViewReport === "Y" ? true : false;
        canEditReport = data[i].canEditReport === "Y" ? true : false;
        canEditBiWeeklyTimeSheet =
          data[i].canEditBiWeeklyTimeSheet === "Y" ? true : false;

        if (
          name === "" ||
          username === "" ||
          password === "" ||
          initial === ""
        ) {
          noOfFail++;
          continue;
        } else {
          const existingUser = await catalogUser.findOne({ username });
          const existingUserInitial = await tenantUser.findOne({ initial });
          if (existingUser || existingUserInitial) {
            noOfFail++;
            continue;
          } else {
            const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            await catalogSession.withTransaction(() => {
              return catalogUser.create(
                [
                  {
                    username,
                    password: encryptedPassword,
                    tenant: req.user.tenantId,
                  },
                ],
                { session: catalogSession }
              );
            });
            await tenantSession.withTransaction(() => {
              return tenantUser.create(
                [
                  {
                    username: username,
                    name: name,
                    initial: initial,
                    right: {
                      accessUserMgmt: accessUserMgmt,
                      canViewAllJob: canViewAllJob,
                      canViewJobList: canViewJobList,
                      canSetJob: canSetJob,
                      canViewOwnJob: canViewOwnJob,
                      canViewOwnJobForTeamMember: canViewOwnJobForTeamMember,
                      canViewReport: canViewReport,
                      canEditReport: canEditReport,
                      canEditBiWeeklyTimeSheet: canEditBiWeeklyTimeSheet,
                      canEditEmailTemplate: canEditEmailTemplate,
                    },
                  },
                ],
                { session: catalogSession }
              );
            });
       

            const mail = tenantDB.model("Mail", mailSchema);
            const mailContent = await mail.findOne({ name: "createUser" });
            let replacedMailContent = mailContent.content.replace(
              "%%USER%%",
              name
            );
            replacedMailContent = replacedMailContent.replace(
              "%%USER_NAME%%",
              username
            );
            replacedMailContent = replacedMailContent.replace(
              "%%PASSWORD%%",
              password
            );

            let nodemailerConfig = getNodemailerConfig();
            let transporter = getEmailConnection(nodemailerConfig);
            let info = await transporter.sendMail({
              from: process.env.EMAIL_USERNAME,
              to: [username],
              subject: mailContent.subject,
              html: replacedMailContent,
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", getTestMessageUrl(info));
            noOfSuccess++;
          }
        }
      }
    }
    catalogSession.endSession();
    tenantSession.endSession();
    res.status(HTTP_OK).json({success:noOfSuccess,fail:noOfFail})
  } catch (error) {
    console.log(
      "🚀 ~ file: batchUpload.js ~ line 53 ~ apiRoute.post ~ error",
      error
    );
    if (error.statusCode === HTTP_FORBIDDEN)
      res.status(HTTP_FORBIDDEN).json({ error: "You don't have right!" });
  } finally {
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
