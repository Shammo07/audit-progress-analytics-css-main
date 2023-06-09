import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import { getCatalogConnection, getTenantConnection } from "@/lib/db";
import catalogUserSchema from "@/models/User";
import userSchema from "@/models/Tenant/User";
import tenantSchema from "@/models/Tenant";
import mailSchema from "@/models/Tenant/Email";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from "@/lib/variables";
//import mailContent from "@/lib/mailContent";
import { sendEmailNotification } from "@/lib/email";

const apiRoute = nextConnect(getDefaultOptions());

apiRoute.post(async (req, res) => {
  try {
    var catalogDB = await getCatalogConnection();
    const User = catalogDB.model("User", catalogUserSchema);
    const tenant = catalogDB.model("Tenant", tenantSchema);
    var tenantDB;
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) throw { statusCode: HTTP_UNAUTHORIZED };

    if (user) {
      const tenantData = await tenant.findById(user.tenant);
      tenantDB = await getTenantConnection(
        tenantData.databaseName,
        tenantData.instanceUrl
      );
      const mail = tenantDB.model("Mail", mailSchema);
      const tenantUser = tenantDB.model("User", userSchema);
      const tenantUserDetail = await tenantUser.findOne({
        username: user.username,
      });
      const mailContent = await mail.findOne({ name: "resetPassword" });
      let replacedMailContent=  mailContent.content.replace("%%USER%%", tenantUserDetail.name);
       replacedMailContent = replacedMailContent.replace(
        "%%RESET_PASSWORD_LINK%%",
        '<a href="' +
          process.env.FRONTEND_BASE_URL +
          "/resetPassword/" +
          user.id +
          ' ">' +
          process.env.FRONTEND_BASE_URL +
          "/resetPassword/" +
          user.id +
          "</a>"
      );
      let info = {
        subject: mailContent.subject,
        html:replacedMailContent
      };

      //todo get email template
      sendEmailNotification(username, null, info.subject, info.html, null);

      return res.json({
        status: "success",
        message: "Reset password link sent,please check email",
      });

      //todo do we need await here?
      sendEmailNotification(username, null, info.subject, info.html, null);

      return res.json({
        status: "success",
        message: "Reset password link sent,please check email",
      });
    }
  } catch (error) {
    if (error.statusCode === HTTP_UNAUTHORIZED)
      return res
        .status(error.statusCode)
        .json({ error: "User doesn't Exist or Wrong Email" });

    res.status(HTTP_BAD_REQUEST).json({ error: "Please enter your email" });
  } finally {
    catalogDB.close(function () {
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
