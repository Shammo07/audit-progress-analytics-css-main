import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import {verifyJWT} from "@/lib/auth";
import {HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, SALT_ROUNDS, TENANTS} from "@/lib/variables";
import {getCatalogConnection, getTenantConfig, getTenantConnection} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";
import mailSchema from "@/models/Tenant/Email";
import {getEmailConnection, getNodemailerConfig, getTestMessageUrl} from "@/lib/email";
import bcrypt from "bcrypt"


const apiRoute = nextConnect(getDefaultOptions());


apiRoute.post(verifyJWT,async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      initial,
      accessUserMgmt,
      canViewAllJob,
      canViewJobList,
      canViewOwnJob,
      canViewOwnJobForTeamMember,
      canSetJob,
      canViewReport,
      canEditReport,
      canEditBiWeeklyTimeSheet,
      canEditEmailTemplate,
    } = req.body;
    let reqUserName = req.user.username;


    const tenantObj =await getTenantConfig(req.user)
    var catalogDB = await getCatalogConnection();
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );
    const catalogSession = await catalogDB.startSession();
    const tenantSession = await tenantDB.startSession();

    const catalogUser = catalogDB.model("User", catalogUserSchema);
    const tenantUser = tenantDB.model("User", tenantUserSchema);

    const existingUser = await catalogUser.findOne({ username });
    const existingUserInitial = await tenantUser.findOne({ initial });

    const checkUserRight = await tenantUser.findOne({ username: reqUserName })

    if (checkUserRight.right[0].accessUserMgmt === false)
      throw { statusCode: HTTP_FORBIDDEN };

    if (existingUser || existingUserInitial) {
      throw { statusCode: HTTP_BAD_REQUEST };
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
                canViewOwnJob:canViewOwnJob,
                canViewOwnJobForTeamMember:canViewOwnJobForTeamMember,
                canViewReport: canViewReport,
                canEditReport: canEditReport,
                canEditBiWeeklyTimeSheet:canEditBiWeeklyTimeSheet,
                canEditEmailTemplate:canEditEmailTemplate,
              },
            },
          ],
          { session: catalogSession }
        );
      });
      catalogSession.endSession();
      tenantSession.endSession();

      const mail = tenantDB.model("Mail", mailSchema);
      const mailContent = await mail.findOne({ name: "createUser" });
      let replacedMailContent=  mailContent.content.replace("%%USER%%", name);
      replacedMailContent = replacedMailContent.replace("%%USER_NAME%%",username)
      replacedMailContent = replacedMailContent.replace("%%PASSWORD%%",password)
      // send email
   
      let nodemailerConfig = getNodemailerConfig();
      let transporter = getEmailConnection(nodemailerConfig);
      let info = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: [username],
        subject: mailContent.subject,
        html:replacedMailContent
        });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", getTestMessageUrl(info));
      res
        .status(200)
        .json({ status: "success", message: "Create User success" });
    }
  } catch (error) {
    console.error(error);
    if (error.statusCode === HTTP_FORBIDDEN)
      res.status(HTTP_FORBIDDEN).json({ error: "You don't have right!" });
    if (error.statusCode === HTTP_BAD_REQUEST) {
      res.status(HTTP_BAD_REQUEST).json({ error: "User already exist" });
    } else {
      res
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
