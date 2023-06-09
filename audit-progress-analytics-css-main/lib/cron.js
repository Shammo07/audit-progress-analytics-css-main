import nextConnect from "next-connect";
import { getDefaultOptions } from "@/lib/nextConnect";
import {
  getCatalogConnection,
  getTenantConfig,
  getTenantConnection,
} from "@/lib/db";
import tenantSchema from "@/models/Tenant";
import jobSchema from "@/models/Tenant/Job";
import userSchema from "@/models/Tenant/User";
import teamSchema from "@/models/Tenant/Team";
import mailSchema from "@/models/Tenant/Email";
import {
  getEmailConnection,
  getNodemailerConfig,
  getTestMessageUrl,
} from "@/lib/email";


export async function cronAlert() {
    try {
        var catalogDB = await getCatalogConnection();
        const tenant = catalogDB.model("Tenant", tenantSchema);
    
        const tenantDetail = await tenant.find({});
        
        for (let i = 0; i < tenantDetail.length; i++) {
          var tenantDB = await getTenantConnection(
            tenantDetail[i].databaseName,
            tenantDetail[i].instanceUrl
          );
    
          const user = tenantDB.model("User", userSchema);
          const job = tenantDB.model("Job", jobSchema);
          const team = tenantDB.model("Team", teamSchema);
          const mail = tenantDB.model("Mail", mailSchema);
    
          const mailContent = await mail.findOne({ name: "overBudget" });
          let nodemailerConfig = getNodemailerConfig();
          let transporter = getEmailConnection(nodemailerConfig);
          let isSent = true;
    
          const WIPJobs = await job
            .find({ status: "WIP" })
            .lean()
            .populate("teamId", "teamLead teamDirector teamMember");
    
          if (WIPJobs.length > 0) {
            for (let j = 0; j < WIPJobs.length; j++) {
              let over70 = false;
              let over85 = false;
              let over100 = false;
              let totalBudgetUnit = 0;
              let totalActualUnit = 0;
              const activities = WIPJobs[j].activities;
    
              if (activities != undefined && activities.length > 0) {
                activities.map((activity, index) => {
                  if (activity.budget != undefined) {
                    totalBudgetUnit += activity.budget;
                  }
                  if (
                    activity.hoursSpent != undefined &&
                    activity.hoursSpent.length > 0
                  ) {
                    activity.hoursSpent.map((hour, index) => {
                      totalActualUnit += hour.hours;
                    });
                  }
                });
                if (totalBudgetUnit / totalActualUnit > 1) {
                  over100 = true;
                } else if (totalBudgetUnit / totalActualUnit > 0.85) {
                  over85 = true;
                } else if (totalBudgetUnit / totalActualUnit > 0.7) {
                  over70 = true;
                }
    
                if (over100 || over85 || over70) {
                  const teamLeaderId = WIPJobs[j].teamId.teamLead;
                  const teamDirectorId = WIPJobs[j].teamId.teamDirector;
                  let teamDirector = undefined;
                  let teamLeader = undefined;
    
                  if (teamLeaderId != undefined) {
                    teamLeader = await user.findById({ _id: teamLeaderId });
                  }
    
                  if (teamDirectorId != undefined) {
                    teamDirector = await user.findById({ _id: teamDirectorId });
                  }
    
                  if (over100) {
                    if (!WIPJobs[j].over100EmailSent && mailContent != null) {
                      let replacedMailContent = mailContent.content.replace(
                        "%%FILE_REFERENCE%%",
                        WIPJobs[j].fileReference
                      );
                      replacedMailContent = replacedMailContent.replace(
                        "%%OVER_BUDGET%%",
                        100
                      );
                      if (teamDirector != undefined && teamLeader != undefined) {
                        let info = await transporter.sendMail({
                          from: process.env.EMAIL_USERNAME,
                          to: teamLeader.username,
                          cc: teamDirector.username,
                          subject: mailContent.subject,
                          html: replacedMailContent,
                        });
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", getTestMessageUrl(info));
    
                        const tenantJobSession = await tenantDB.startSession();
                        await tenantJobSession.withTransaction(() => {
                          return job.findOneAndUpdate(
                            { fileReference: WIPJobs[j].fileReference },
                            {
                              over100EmailSent: isSent,
                            },
                            { session: tenantJobSession }
                          );
                        });
                        tenantJobSession.endSession();
                      }
                    }
                  } else if (over85) {
                    if (!WIPJobs[j].over85EmailSent && mailContent != null) {
                      let replacedMailContent = mailContent.content.replace(
                        "%%FILE_REFERENCE%%",
                        WIPJobs[j].fileReference
                      );
                      replacedMailContent = replacedMailContent.replace(
                        "%%OVER_BUDGET%%",
                        85
                      );
                      if (teamDirector != undefined && teamLeader != undefined) {
                        let info = await transporter.sendMail({
                          from: process.env.EMAIL_USERNAME,
                          to: teamLeader.username,
                          cc: teamDirector.username,
                          subject: mailContent.subject,
                          html: replacedMailContent,
                        });
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", getTestMessageUrl(info));
    
                        const tenantJobSession = await tenantDB.startSession();
                        await tenantJobSession.withTransaction(() => {
                          return job.findOneAndUpdate(
                            { fileReference: WIPJobs[j].fileReference },
                            {
                              over85EmailSent: isSent,
                            },
                            { session: tenantJobSession }
                          );
                        });
                        tenantJobSession.endSession();
                      }
                    }
                  } else if (over70) {
                    if (!WIPJobs[j].over70EmailSent && mailContent != null) {
                      let replacedMailContent = mailContent.content.replace(
                        "%%FILE_REFERENCE%%",
                        WIPJobs[j].fileReference
                      );
                      replacedMailContent = replacedMailContent.replace(
                        "%%OVER_BUDGET%%",
                        70
                      );
    
                      if (teamLeader != undefined) {
                        let info = await transporter.sendMail({
                          from: process.env.EMAIL_USERNAME,
                          to: teamLeader.username,
                          subject: mailContent.subject,
                          html: replacedMailContent,
                        });
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", getTestMessageUrl(info));
    
                        const tenantJobSession = await tenantDB.startSession();
                        await tenantJobSession.withTransaction(() => {
                          return job.findOneAndUpdate(
                            { fileReference: WIPJobs[j].fileReference },
                            {
                              over70EmailSent: isSent,
                            },
                            { session: tenantJobSession }
                          );
                        });
                        tenantJobSession.endSession();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("🚀 ~ file: alert.js:180 ~ apiRoute.get ~ error:", error);
      } finally {
        catalogDB.close(function () {
          console.log("Mongoose connection Tenant Connection closed");
        });
        tenantDB.close(function () {
          console.log("Mongoose connection Tenant Connection closed");
        });
      }
}