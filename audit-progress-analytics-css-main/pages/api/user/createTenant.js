import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  SALT_ROUNDS,
  HTTP_OK,
  TENANTS,
} from "@/lib/variables";
import {
  getCatalogConnection,
  getTenantConfig,
  getTenantConnection,
  getDBConnection,
} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";
import tenantSchema from "@/models/Tenant";
import mailSchema from "@/models/Tenant/Email";
import {
  getEmailConnection,
  getNodemailerConfig,
  getTestMessageUrl,
} from "@/lib/email";
import mailContent from "@/lib/mailContent";
import bcrypt from "bcrypt";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.post(async (req, res) => {
  try {
    const { name, username, databaseName, initial, password ,instanceUrl} = req.body;

    var catalogDB = await getCatalogConnection();

    const catalogUser = catalogDB.model("User", catalogUserSchema);
    const tenant = catalogDB.model("Tenant", tenantSchema);
  

    const existingDatabase = await tenant.findOne({
      databaseName: databaseName,
    });

    if (existingDatabase) throw { statusCode: HTTP_BAD_REQUEST };

    const catalogSession = await catalogDB.startSession();

    await catalogSession.withTransaction(() => {
      return tenant.create(
        [
          {
            username,
            password,
            databaseName,
            instanceUrl,
            isLocal: true,
          },
        ],
        { session: catalogSession }
      );
    });

    var tenantDB = await getTenantConnection(
      databaseName,
      instanceUrl
    );

    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const tenantDetail = await tenant.findOne({ databaseName: databaseName });
    const tenantUser = tenantDB.model("User", tenantUserSchema);
    const tenantMail= tenantDB.model("Mail", mailSchema);
    const tenantSession = await tenantDB.startSession();
    await catalogSession.withTransaction(() => {
      return catalogUser.create(
        [
          {
            username,
            password: encryptedPassword,
            tenant: tenantDetail._id,
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
              accessUserMgmt: true,
              canViewAllJob: true,
              canViewJobList: true,
              canViewOwnJob: true,
              canSetJob: true,
              canViewReport: true,
              canEditReport: true,
              canEditBiWeeklyTimeSheet: true,
              canEditEmailTemplate:true,
            },
            isSuperAdmin:true,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.resetPassword.name,
            subject:mailContent.resetPassword.subject,
            description:mailContent.resetPassword.description,
            content:mailContent.resetPassword.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.createUser.name,
            subject:mailContent.createUser.subject,
            description:mailContent.createUser.description,
            content:mailContent.createUser.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.createBudget.name,
            subject:mailContent.createBudget.subject,
            description:mailContent.createBudget.description,
            content:mailContent.createBudget.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.approve.name,
            subject:mailContent.approve.subject,
            description:mailContent.approve.description,
            content:mailContent.approve.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.memberSendOtReport.name,
            subject:mailContent.memberSendOtReport.subject,
            description:mailContent.memberSendOtReport.description,
            content:mailContent.memberSendOtReport.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.leaderSendOtReport.name,
            subject:mailContent.leaderSendOtReport.subject,
            description:mailContent.leaderSendOtReport.description,
            content:mailContent.leaderSendOtReport.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.rejectBudget.name,
            subject:mailContent.rejectBudget.subject,
            description:mailContent.rejectBudget.description,
            content:mailContent.rejectBudget.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.sendOTReportToAdmin.name,
            subject:mailContent.sendOTReportToAdmin.subject,
            description:mailContent.sendOTReportToAdmin.description,
            content:mailContent.sendOTReportToAdmin.content,
          },
        ],
        { session: tenantSession }
      );
    });
    await tenantSession.withTransaction(() => {
      return tenantMail.create(
        [
          {
            name:mailContent.overBudget.name,
            subject:mailContent.overBudget.subject,
            description:mailContent.overBudget.description,
            content:mailContent.overBudget.content,
          },
        ],
        { session: tenantSession }
      );
    });

    catalogSession.endSession();
    tenantSession.endSession();

    const mailContents = await tenantMail.findOne({ name: "createUser" });
    let replacedMailContent=  mailContents.content.replace("%%USER%%", name);
    replacedMailContent = replacedMailContent.replace("%%USER_NAME%%",username)
    replacedMailContent = replacedMailContent.replace("%%PASSWORD%%",password)
    let nodemailerConfig = getNodemailerConfig();
    let transporter = getEmailConnection(nodemailerConfig);
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: [username],
      subject: mailContents.subject,
      html:replacedMailContent
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", getTestMessageUrl(info));
    res.status(HTTP_OK).json({ status: "success", message: "Create tenant success" });
  } catch (error) {

    if (error.statusCode === HTTP_BAD_REQUEST) {
      res.status(HTTP_BAD_REQUEST).json({ error: "Tenant/User already exist" });
    } else {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ error: "Unknown server error" });
    }
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
