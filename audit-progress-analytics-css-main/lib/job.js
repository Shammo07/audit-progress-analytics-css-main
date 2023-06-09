import { getTenantConnection, getTenantConfig } from "@/lib/db";
import jobSchema from "@/models/Tenant/Job";
import userSchema from "@/models/Tenant/User";
import teamSchema from "@/models/Tenant/Team";
import otSchema from "@/models/Tenant/Ot";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
} from "@/lib/variables";
import mongoose from "mongoose";


export async function getAllJob(jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let jobs = {};
    let jobsArray = [];
    let teamLeadName = "";
    let teamDirectorName = "";

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantUser = tenantDB.model("User", userSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const checkUserRight = await tenantUser.findOne({
      username: jwtUser.username,
    });

    if (
      checkUserRight.right[0].canViewJobList === false &&
      checkUserRight.right[0].canViewAllJob === false
    )
      throw { statusCode: HTTP_FORBIDDEN };

    const job = await tenantJob
      .find({})
      .lean()
      .populate("teamId", "teamLead teamDirector teamMember");

    if (!job) throw { statusCode: HTTP_INTERNAL_SERVER_ERROR };
    if (job) {
      for (let i = 0; i < job.length; i++) {
        let teamMembers = [];
        let chargeOutRates = [];
        let actualCost = 0;
        let budgetUnit = 0;
        let actualUnit = 0;
        let budgetCost = 0;
        let totalActualCost = 0;
        let totalBudgetCost = 0;
        let partnerActualTotal = 0;
        let partnerBudgetTotal = 0;
        let staffUnitFees = 0;
        let staffBudgetUnitFees = 0;

        let progressReportButton;
        const jobId = job[i]._id;
        const fileRef = job[i].fileReference;
        const status = job[i].status;
        const clientName = job[i].clientName;
        const groupComp = job[i].groupCompany;
        const teamLeadId = job[i].teamId.teamLead;
        const teamDirectorId = job[i].teamId.teamDirector;
        const teamMemberId = job[i].teamId.teamMember;
        const revenue = job[i].revenue;
        const prepareBy = job[i].preparedBy.initial;
        let prepareDate = job[i].preparedBy.date;
        const budgetAndPerformButton = jobId.valueOf();
        const teamLead = await tenantUser.findById({ _id: teamLeadId });
        teamLeadName = teamLead.name;
        const teamDirector = await tenantUser.findById({ _id: teamDirectorId });
        teamDirectorName = teamDirector.name;
        const teamMember = await tenantUser.find({ _id: teamMemberId });
        const activities = job[i].activities;

        if (job[i].chargeOutRates != undefined)
          chargeOutRates = job[i].chargeOutRates;

        if (job[i].partnersBudgetUnitsAt != undefined) {
          if (job[i].partnersBudgetUnitsAt.unit != undefined)
            budgetUnit = job[i].partnersBudgetUnitsAt.unit;
          if (job[i].partnersBudgetUnitsAt.total != undefined)
            partnerBudgetTotal = job[i].partnersBudgetUnitsAt.total;
        }

        if (job[i].partnersActualUnitsAt != undefined) {
          if (job[i].partnersActualUnitsAt.unit != undefined)
            actualUnit = job[i].partnersActualUnitsAt.unit;
          if (job[i].partnersActualUnitsAt.total != undefined)
            partnerActualTotal = job[i].partnersActualUnitsAt.total;
        }

        if (job[i].budgetExpenses != undefined)
          budgetCost = job[i].budgetExpenses;

        if (job[i].actualExpenses != undefined)
          actualCost = job[i].actualExpenses;

        if (prepareDate == undefined) {
          prepareDate = "";
        } else {
          prepareDate = new Date(prepareDate).toLocaleDateString('zh-Hans-CN');
        }

        if (status != " ") progressReportButton = fileRef;
        else progressReportButton = null;
        for (let x = 0; x < teamMember.length; x++) {
          teamMembers.push(teamMember[x].initial + " ");
        }

        if (
          activities != undefined &&
          activities.length > 0 &&
          chargeOutRates != undefined &&
          chargeOutRates.length > 0
        ) {
          activities.map((activity, index) => {
            let indexArray = [];
            let teamMemberIdToString = [];
            let totalBudgetHour = 0;
            let x2 = 0;
            let x3 = 0;
            let totalHour = 0;
            teamMemberId.map((e) => teamMemberIdToString.push(e.valueOf()));
            const x = teamMemberIdToString.indexOf(activity.doneBy.valueOf());
            const initial = teamMembers[x].trim();
            for (let j = 0; j < chargeOutRates.length; j++) {
              if (chargeOutRates[j].initial == initial) {
                indexArray.push(j);
              }
            }

            if (activity.budget != undefined) {
              for (let j = 0; j < indexArray.length; j++) {
                x2 = indexArray[0];
                break;
              }

              totalBudgetHour = activity.budget;
            }

            staffBudgetUnitFees +=
              totalBudgetHour * chargeOutRates[x2].chargeOutRates;

            if (
              activity.hoursSpent != undefined &&
              activity.hoursSpent.length > 0
            ) {
              activity.hoursSpent.map((hour, index) => {
                const doneDate = hour.date;
                let indexDate;
                for (let j = indexArray.length - 1; j >= 0; j--) {
                  indexDate = chargeOutRates[indexArray[j]].createDate;
                  if (doneDate > indexDate) {
                    x3 = indexArray[j];
                    break;
                  } else {
                    x3 = indexArray[0];
                  }
                }
                totalHour = hour.hours;
                staffUnitFees += totalHour * chargeOutRates[x3].chargeOutRates;
              });
            }
          });
        }
        totalActualCost = partnerActualTotal + staffUnitFees + actualCost;

        totalBudgetCost = partnerBudgetTotal + budgetCost + staffBudgetUnitFees;

        jobs = {
          fileReference: fileRef,
          status: status,
          clientName: clientName,
          groupCompany: groupComp,
          teamMember: teamMembers,
          teamLead: teamLeadName,
          teamDirector: teamDirectorName,
          budgetUnit: budgetUnit,
          actualUnit: actualUnit,
          budgetCost: totalBudgetCost,
          actualCost: totalActualCost,
          revenue: revenue,
          preparedBy: prepareBy,
          preparedDate: prepareDate,
          budgetAndPerform: budgetAndPerformButton,
          progressReport: progressReportButton,
        };
        jobsArray.push(jobs);

        jobs = {};
      }
    }
    return jobsArray;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getOwnJob(jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    const tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let jobs = {};
    let jobsArray = [];
    let teamLeadName = "";
    let teamDirectorName = "";

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantUser = tenantDB.model("User", userSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const user = await tenantUser.findOne({ username: jwtUser.username });

    if (user.right[0].canViewOwnJob === false)
      throw { statusCode: HTTP_FORBIDDEN };

    const teamId = user.team;

    const job = await tenantJob
      .find({ teamId: teamId })
      .lean()
      .populate("teamId", "teamLead teamDirector teamMember");

    if (!job) throw { statusCode: HTTP_INTERNAL_SERVER_ERROR };

    if (job) {
      for (let i = 0; i < job.length; i++) {
        let teamMembers = [];
        let chargeOutRates = [];
        let actualCost = 0;
        let budgetUnit = 0;
        let actualUnit = 0;
        let budgetCost = 0;
        let totalActualCost = 0;
        let totalBudgetCost = 0;
        let partnerActualTotal = 0;
        let partnerBudgetTotal = 0;
        let staffUnitFees = 0;
        let staffBudgetUnitFees = 0;

        let progressReportButton;
        const jobId = job[i]._id;
        const fileRef = job[i].fileReference;
        const status = job[i].status;
        const clientName = job[i].clientName;
        const groupComp = job[i].groupCompany;
        const teamLeadId = job[i].teamId.teamLead;
        const teamDirectorId = job[i].teamId.teamDirector;
        const teamMemberId = job[i].teamId.teamMember;
        const revenue = job[i].revenue;
        const prepareBy = job[i].preparedBy.initial;
        let prepareDate = job[i].preparedBy.date;
        const budgetAndPerformButton = jobId.valueOf();
        const teamLead = await tenantUser.findById({ _id: teamLeadId });
        teamLeadName = teamLead.name;
        const teamDirector = await tenantUser.findById({ _id: teamDirectorId });
        teamDirectorName = teamDirector.name;
        const teamMember = await tenantUser.find({ _id: teamMemberId });
        const activities = job[i].activities;

        if (job[i].chargeOutRates != undefined)
          chargeOutRates = job[i].chargeOutRates;

        if (job[i].partnersBudgetUnitsAt != undefined) {
          if (job[i].partnersBudgetUnitsAt.unit != undefined)
            budgetUnit = job[i].partnersBudgetUnitsAt.unit;
          if (job[i].partnersBudgetUnitsAt.total != undefined)
            partnerBudgetTotal = job[i].partnersBudgetUnitsAt.total;
        }

        if (job[i].partnersActualUnitsAt != undefined) {
          if (job[i].partnersActualUnitsAt.unit != undefined)
            actualUnit = job[i].partnersActualUnitsAt.unit;
          if (job[i].partnersActualUnitsAt.total != undefined)
            partnerActualTotal = job[i].partnersActualUnitsAt.total;
        }

        if (job[i].budgetExpenses != undefined)
          budgetCost = job[i].budgetExpenses;

        if (job[i].actualExpenses != undefined)
          actualCost = job[i].actualExpenses;

        if (prepareDate == undefined) {
          prepareDate = "";
        } else {
          prepareDate = new Date(prepareDate).toLocaleDateString('zh-Hans-CN');
        }

        if (status != " ") progressReportButton = fileRef;
        else progressReportButton = null;
        for (let x = 0; x < teamMember.length; x++) {
          teamMembers.push(teamMember[x].initial + " ");
        }

        if (
          activities != undefined &&
          activities.length > 0 &&
          chargeOutRates != undefined &&
          chargeOutRates.length > 0
        ) {
          activities.map((activity, index) => {
            let indexArray = [];
            let teamMemberIdToString = [];
            let totalBudgetHour = 0;
            let x2 = 0;
            let x3 = 0;
            let totalHour = 0;
            teamMemberId.map((e) => teamMemberIdToString.push(e.valueOf()));
            const x = teamMemberIdToString.indexOf(activity.doneBy.valueOf());
            const initial = teamMembers[x].trim();
            for (let j = 0; j < chargeOutRates.length; j++) {
              if (chargeOutRates[j].initial == initial) {
                indexArray.push(j);
              }
            }

            if (activity.budget != undefined) {
              for (let j = 0; j < indexArray.length; j++) {
                x2 = indexArray[0];
                break;
              }

              totalBudgetHour = activity.budget;
            }

            staffBudgetUnitFees +=
              totalBudgetHour * chargeOutRates[x2].chargeOutRates;

            if (
              activity.hoursSpent != undefined &&
              activity.hoursSpent.length > 0
            ) {
              activity.hoursSpent.map((hour, index) => {
                const doneDate = hour.date;
                let indexDate;
                for (let j = indexArray.length - 1; j >= 0; j--) {
                  indexDate = chargeOutRates[indexArray[j]].createDate;
                  if (doneDate > indexDate) {
                    x3 = indexArray[j];
                    break;
                  } else {
                    x3 = indexArray[0];
                  }
                }
                totalHour = hour.hours;
                staffUnitFees += totalHour * chargeOutRates[x3].chargeOutRates;
              });
            }
          });
        }
        totalActualCost = partnerActualTotal + staffUnitFees + actualCost;

        totalBudgetCost = partnerBudgetTotal + budgetCost + staffBudgetUnitFees;

        jobs = {
          fileReference: fileRef,
          status: status,
          clientName: clientName,
          groupCompany: groupComp,
          teamMember: teamMembers,
          teamLead: teamLeadName,
          teamDirector: teamDirectorName,
          budgetUnit: budgetUnit,
          actualUnit: actualUnit,
          budgetCost: totalBudgetCost,
          actualCost: totalActualCost,
          revenue: revenue,
          preparedBy: prepareBy,
          preparedDate: prepareDate,
          budgetAndPerform: budgetAndPerformButton,
          progressReport: progressReportButton,
        };
        jobsArray.push(jobs);

        jobs = {};
      }
    }
    return jobsArray;
  } catch (e) {
    throw e;
  }
}

export async function getJob(id, jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let jobs = {};
    let teamLeadName = "";
    let teamDirectorName = "";
    let isTeamLead = false;
    let reviewedDate;
    let tempTeamMemberId;

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantUser = tenantDB.model("User", userSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const user = await tenantUser.findOne({ username: jwtUser.username });
    const job = await tenantJob
      .findById({ _id: id })
      .lean()
      .populate("teamId", "teamLead teamDirector teamMember");

    /*    if (!job) throw { statusCode: HTTP_INTERNAL_SERVER_ERROR }; */

    const teamLeadId = job.teamId.teamLead;
    const teamLead = await tenantUser.findById({ _id: teamLeadId });
    teamLeadName = teamLead.name;
    if (jwtUser.id === teamLeadId.valueOf()) isTeamLead = true;

    /*     if (
      user.right[0].canSetJob == false &&
      user.right[0].canViewAllJob == false &&
      !isTeamLead
    )
      throw { statusCode: HTTP_FORBIDDEN }; */

    if (job) {
      let isPreparer = false;
      let teamMembers = [];
      let teamMember = [];

      const fileRef = job.fileReference;
      const status = job.status;
      const clientName = job.clientName;
      const groupCompany = job.groupCompany;
      const revenue = job.revenue;
      const teamDirectorId = job.teamId.teamDirector;
      const teamMemberId = job.teamId.teamMember;

      const teamDirector = await tenantUser.findById({ _id: teamDirectorId });
      teamDirectorName = teamDirector.name;
      for (let i = 0; i < teamMemberId.length; i++) {
        tempTeamMemberId = await tenantUser.findById({ _id: teamMemberId[i] });
        teamMember.push(tempTeamMemberId);
      }
      //teamMember = await tenantUser.find({ _id: teamMemberId });
      const prepareBy = job.preparedBy.initial;
      const prepareDate = job.preparedBy.date;
      if (job.reviewedBy != undefined) reviewedDate = job.reviewedBy.date;
      const partnersBudgetUnitsAt = job.partnersBudgetUnitsAt;
      const chargeOutRates = job.chargeOutRates;
      const budgetExpenses = job.budgetExpenses;
      const activities = job.activities;
      const discussedWithClient = job.discussedWithClient;
      const budgetApproved = job.budgetApproved;
      const feeLastYear = job.feeLastYear;
      const totalCostsLastYearHKD = job.totalCostsLastYearHKD;
      const isApprove = job.isApprove;
      const isSubmit = job.isSubmit;
      const partnersActualUnitsAt = job.partnersActualUnitsAt;
      const actualExpenses = job.actualExpenses;
      if (user.initial == prepareBy) isPreparer = true;
      for (let x = 0; x < teamMember.length; x++) {
        teamMembers.push(teamMember[x].initial);
      }

      jobs = {
        fileReference: fileRef,
        status: status,
        clientName: clientName,
        groupCompany: groupCompany,
        teamMember: teamMembers,
        teamMemberId: teamMemberId,
        teamLead: teamLeadName,
        teamDirector: teamDirectorName,
        prepareBy: prepareBy,
        prepareDate: prepareDate,
        reviewedDate: reviewedDate,
        chargeOutRates: chargeOutRates,
        partnersBudgetUnitsAt: partnersBudgetUnitsAt,
        budgetExpenses: budgetExpenses,
        discussedWithClient: discussedWithClient,
        budgetApproved: budgetApproved,
        totalCostsLastYearHKD: totalCostsLastYearHKD,
        isTeamLead: isTeamLead,
        isPreparer: isPreparer,
        feeLastYear: feeLastYear,
        isSubmit: isSubmit,
        isApprove: isApprove,
        actualExpenses: actualExpenses,
        partnersActualUnitsAt: partnersActualUnitsAt,
        activities: activities,
        revenue: revenue,
      };

      return jobs;
    }
  } catch (error) {
    throw error;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getJobForEditJob(id, jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let jobs = {};
    let teamLeadName = "";
    let teamDirectorName = "";
    let isTeamLead = false;
    let reviewedDate;
    let tempTeamMemberId;
    let teamMembers = [];
    let teamMember = [];

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantUser = tenantDB.model("User", userSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const user = await tenantUser.findOne({ username: jwtUser.username });
    const job = await tenantJob
      .findById({ _id: id })
      .lean()
      .populate("teamId", "teamLead teamDirector teamMember");

    const teamLeadId = job.teamId.teamLead;
    const teamLead = await tenantUser.findById({ _id: teamLeadId });
    teamLeadName = teamLead.name;

 

    if (jwtUser.id === teamLeadId.valueOf()) isTeamLead = true;

    if (job) {
      const fileRef = job.fileReference;
      const clientName = job.clientName;
      const groupCompany = job.groupCompany;
      const revenue = job.revenue;
      const teamMemberId = job.teamId.teamMember;
      teamMemberId.map((e) => teamMember.push(e.valueOf()));

      jobs = {
        fileReference: fileRef,
        clientName: clientName,
        groupCompany: groupCompany,
        revenue: revenue,
        teamMember: teamMember,
      };

      console.log("🚀 ~ file: job.js:567 ~ getJobForEditJob ~ jobs", jobs)

      return jobs;
    }
  } catch (error) {
    throw error;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getOneJob(jwtUser, fileReference, reqUserId) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);

    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const userId = reqUserId ? reqUserId : jwtUser.id;

    let job;
    job = await tenantJob.aggregate([
      {
        $match: {
          fileReference: fileReference,
        },
      },
      {
        $unwind: {
          path: "$activities",
          includeArrayIndex: "activityIndex",
        },
      },
      {
        $match: {
          "activities.doneBy": new mongoose.Types.ObjectId(userId),
        },
      },
    ]);

    if (job) {
      return job;
    } else {
      throw { statusCode: HTTP_BAD_REQUEST };
    }
  } catch (error) {
    console.log("🚀 ~ file: job.js ~ line 376 ~ getOneJob ~ error", error);
    throw error;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getTwoWeeksOfJobsProps(jwtUser, reqUserId) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantOt = tenantDB.model("Ot", otSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);
    const tenantUser = tenantDB.model("User", userSchema);

    let userId;
    let team = [];

    userId = reqUserId ? reqUserId : jwtUser.id;

    const query = twoWeeksJobsAggregation(new mongoose.Types.ObjectId(userId));
    const job = await tenantJob.aggregate(query);

    let ot = await tenantOt.aggregate(
      submittedOtAggregation(new mongoose.Types.ObjectId(userId), null)
    );

    if (job.length != 0) {
      for (let j of job) {
        team.push(
          (
            await tenantTeam
              .findOne({ _id: j.teamId })
              .lean()
              .populate("teamLead")
          ).teamLead.initial
        );
      }
    }

    if (ot.length === 0) ot = null;
    else ot = ot[0]; //becuase aggregation always return []
    if (!job) throw { statusCode: HTTP_BAD_REQUEST };

    return [job, ot, team];
  } catch (error) {
    throw error;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getSubmittedOtReportProps(jwtUser, reqUserId, date) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    const tenantOt = tenantDB.model("Ot", otSchema);

    let userId;

    userId = reqUserId ? reqUserId : jwtUser.id;

    let ot = await tenantOt.aggregate(
      submittedOtAggregation(new mongoose.Types.ObjectId(userId), date)
    );

    ot = ot[0];

    return [ot];
  } catch (error) {
    throw error;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}

export async function getAllJobForAnalytics(jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let jobs = {};
    let jobsArray = [];
    let teamLeadName = "";
    let teamDirectorName = "";

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantUser = tenantDB.model("User", userSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);

    const job = await tenantJob
      .find({})
      .lean()
      .populate("teamId", "teamLead teamDirector teamMember");

    if (!job) throw { statusCode: HTTP_INTERNAL_SERVER_ERROR };
    if (job) {
      for (let i = 0; i < job.length; i++) {
        let teamMembers = [];
        let chargeOutRates = [];
        let indexArray = [];
        let actualCost = 0;
        let budgetUnit = 0;
        let actualUnit = 0;
        let budgetCost = 0;
        let staffUnitFees = 0;
        let staffBudgetUnitFees = 0;
        let totalActualCost = 0;
        let totalBudgetCost = 0;
        let partnerActualTotal = 0;
        let partnerBudgetTotal = 0;
        let ROI = 0;
        let forDivisionRevenue = 0;
        let totalBudgetUnit = 0;
        let totalActualUnit = 0;

        const jobId = job[i]._id;
        const fileRef = job[i].fileReference;
        const status = job[i].status;
        const clientName = job[i].clientName;
        const groupComp = job[i].groupCompany;
        const teamLeadId = job[i].teamId.teamLead;
        const teamDirectorId = job[i].teamId.teamDirector;
        const teamMemberId = job[i].teamId.teamMember;
        const activities = job[i].activities;
        if (job[i].chargeOutRates != undefined)
          chargeOutRates = job[i].chargeOutRates;

        if (
          job[i].partnersBudgetUnitsAt != undefined &&
          job[i].partnersBudgetUnitsAt.unit != undefined
        )
          budgetUnit = job[i].partnersBudgetUnitsAt.unit;
        if (job[i].partnersActualUnitsAt != undefined) {
          if (job[i].partnersActualUnitsAt.unit != undefined)
            actualUnit = job[i].partnersActualUnitsAt.unit;
          if (job[i].partnersActualUnitsAt.total != undefined)
            partnerActualTotal = job[i].partnersActualUnitsAt.total;
        }

        if (job[i].budgetExpenses != undefined)
          budgetCost = job[i].budgetExpenses;
        if (job[i].actualExpenses != undefined)
          actualCost = job[i].actualExpenses;

        const revenue = job[i].revenue;
        const teamLead = await tenantUser.findById({ _id: teamLeadId });
        teamLeadName = teamLead.name;
        const teamDirector = await tenantUser.findById({ _id: teamDirectorId });
        teamDirectorName = teamDirector.name;
        const teamMember = await tenantUser.find({ _id: teamMemberId });
        const prepareBy = job[i].preparedBy.initial;
        let prepareDate = job[i].preparedBy.date;
        if (prepareDate == undefined) {
          prepareDate = "";
        } else {
          prepareDate = new Date(prepareDate).toLocaleDateString();
        }
        for (let x = 0; x < teamMember.length; x++) {
          teamMembers.push(teamMember[x].initial);
        }
        //if (status === "completed") {
        if (
          activities != undefined &&
          activities.length > 0 &&
          chargeOutRates != undefined &&
          chargeOutRates.length > 0
        ) {
          activities.map((activity, index) => {
            let indexArray = [];
            let teamMemberIdToString = [];
            let totalBudgetHour = 0;
            let x2 = 0;
            let x3 = 0;
            let totalHour = 0;
            teamMemberId.map((e) => teamMemberIdToString.push(e.valueOf()));
            const x = teamMemberIdToString.indexOf(activity.doneBy.valueOf());
            const initial = teamMembers[x].trim();
            for (let j = 0; j < chargeOutRates.length; j++) {
              if (chargeOutRates[j].initial == initial) {
                indexArray.push(j);
              }
            }

            if (activity.budget != undefined) {
              for (let j = 0; j < indexArray.length; j++) {
                x2 = indexArray[0];
                break;
              }

              totalBudgetHour = activity.budget;
              totalBudgetUnit += activity.budget;
            }

            if (
              activity.hoursSpent != undefined &&
              activity.hoursSpent.length > 0
            ) {
              activity.hoursSpent.map((hour, index) => {
                const doneDate = hour.date;
                let indexDate;
                for (let j = indexArray.length - 1; j >= 0; j--) {
                  indexDate = chargeOutRates[indexArray[j]].createDate;
                  if (doneDate > indexDate) {
                    x3 = indexArray[j];
                    break;
                  } else {
                    x3 = indexArray[0];
                  }
                }
                totalHour = hour.hours;
                totalActualUnit += hour.hours;
                staffUnitFees += totalHour * chargeOutRates[x3].chargeOutRates;
              });
            }
          });
        }

        totalActualCost = partnerActualTotal + staffUnitFees + actualCost;

        if (revenue == 0) forDivisionRevenue = 1;
        else forDivisionRevenue = revenue;

        ROI = (revenue - totalActualCost) / forDivisionRevenue;

        if (job[i].isHistory != undefined && job[i].isHistory === true) {
          totalBudgetUnit = job[i].oldBudgetUnits;
          totalActualUnit = job[i].oldActualUnits;
        }

        //}
        jobs = {
          fileReference: fileRef,
          status: status,
          clientName: clientName,
          groupCompany: groupComp,
          teamMember: teamMembers,
          teamLead: teamLeadName,
          teamDirector: teamDirectorName,
          budgetUnit: totalBudgetUnit,
          actualUnit: totalActualUnit,
          budgetCost: budgetCost,
          actualCost: totalActualCost,
          revenue: revenue,
          preparedBy: prepareBy,
          preparedDate: prepareDate,
          ROI: parseFloat(ROI * 100).toFixed(2),
        };
        jobsArray.push(jobs);

        jobs = {};
      }
    }
    return jobsArray;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}
