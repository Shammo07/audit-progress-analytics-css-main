import { request } from "./request";
import { store } from "../redux/index";



export function createJob(job) {
  const states = store.getState();
  const url = "/job/create";
  return new Promise((resolve, reject) => {
    request
      .post(url, job, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function editJob(job) {
  const states = store.getState();
  const url = "/job/editJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, job, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function deleteJob(id) {
  const states = store.getState();
  const url = "/job/deleteJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getAllJobProps(token) {
  // console.log("🚀 ~ file: job.js ~ line 23 ~ getAllJobProps ~ token", token)
  const url = "/job/getAllJob";
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export function getAllJobByPage(page, perPage,jobStatus) {
  const states = store.getState();
  const url = "/job/getAllJobByPage";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { page, perPage,jobStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + states.authentication.token,
          },
        }
      )
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export function getAllJobCount(jobStatus) {
  const states = store.getState();
  const url = "/job/getAllJobCount";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobStatus,{
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export function getOwnTeamMemberJobByPage(page, perPage,jobStatus) {
  const states = store.getState();
  const url = "/job/getOwnTeamMemberJobByPage";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { page, perPage ,jobStatus},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + states.authentication.token,
          },
        }
      )
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export function getOwnJobByPage(page, perPage,jobStatus) {
  const states = store.getState();
  const url = "/job/getOwnJobByPage";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { page, perPage ,jobStatus},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + states.authentication.token,
          },
        }
      )
      .then((res) => {
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        //console.log(err)
        reject(err);
      });
  });
}

export function getOwnJobCount(jobStatus) {
  const states = store.getState();
  const url = "/job/getOwnJobCount";
  return new Promise((resolve, reject) => {
    request
      .post(url,{jobStatus}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + states.authentication.token,
        },
      })
      .then((res) => {
        console.log("🚀 ~ file: job.js ~ line 86 ~ .then ~ res", res);
        //console.log(res)
        resolve(res);
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: job.js ~ line 91 ~ returnnewPromise ~ err",
          err
        );
        //console.log(err)
        reject(err);
      });
  });
}

/* export function getJob(id) {
  const states = store.getState();
  const url = "/job/getJob";
  console.log(id)
  return new Promise((resolve, reject) => {
    request
      .post(url,{id}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
 */

export function getJobProps(id, token) {
  const url = "/job/getJob";
  console.log(id);
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + token,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function createBudget(jobs) {
  const states = store.getState();
  const url = "/job/createBudget";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function saveJob(jobs) {
  const states = store.getState();
  const url = "/job/saveJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function completeJob(jobs) {
  const states = store.getState();
  const url = "/job/completeJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function promote(jobs) {
  const states = store.getState();
  const url = "/job/promote";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function approveJob(jobs) {
  const states = store.getState();
  const url = "/job/approveJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function rejectJob(jobs) {
  const states = store.getState();
  const url = "/job/rejectJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, jobs, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getOwnJobProps(token) {
  const url = "/job/getOwnJob";

  return new Promise((resolve, reject) => {
    request
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getJobProgressReportProps(token, fileReference) {
  //jimmy
  //const states=store.getState();
  const url = "/job/getOneJob";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { fileReference },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + token,
            //states.authentication.token
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getJobProgressReport(jwtUser, fileReference, userId) {
  //jimmy
  const states = store.getState();
  const url = "/job/getOneJob";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { fileReference, userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + states.authentication.token,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function saveJobProgressReport(job) {
  //jimmy
  const states = store.getState();
  const url = "/job/saveOneJob";
  return new Promise((resolve, reject) => {
    request
      .post(url, job, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getTwoWeeksOfJobs(token, userId) {
  console.log(
    "🚀 ~ file: job.js ~ line 267 ~ getTwoWeeksOfJobs ~ token",
    token
  );
  //jimmy
  const states = store.getState(); //TODO add back no passing token version
  const url = "/job/getTwoWeeksOfJobs";

  let processedToken;
  if (token) processedToken = token;
  else processedToken = states.authentication.token;

  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + processedToken,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getPosition(token, fileReference) {
  //jimmy
  //const states=store.getState();
  const url = "/job/getPosition";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { fileReference },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + token,
            //states.authentication.token
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err.response.data));
  });
}

export function saveOtReport({
  doneBy,
  dates,
  jobReference,
  client,
  units,
  teamLeader,
  approvedUnits,
  comments,
}) {
  //jimmy
  const states = store.getState();
  const url = "/job/saveOtReport";
  const data = {
    doneBy,
    dates,
    jobReference,
    client,
    units,
    teamLeader,
    approvedUnits,
    comments,
  };
  console.log(data);
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function updateOtReport(data) {
  //jimmy
  const states = store.getState();
  const url = "/job/updateOtReport";
  console.log(data);
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getSubmittedOtReport(token, userId, date) {
  //jimmy
  const states = store.getState(); //TODO add back no passing token version
  const url = "/job/getSubmittedOtReport";

  let processedToken;
  if (token) processedToken = token;
  else processedToken = states.authentication.token;

  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { userId, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + processedToken,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getApprovedOtReport(token, userId, date) {
  //jimmy
  const states = store.getState();
  const processedToken = token ? token : states.authentication.token;

  const url = "/job/getApprovedOtReport";
  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { userId, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + processedToken,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

export function submitToAdmin(data) {
  //jimmy
  const states = store.getState(); //TODO add back no passing token version
  const url = "/job/submitToAdmin";
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function getBiWeeklyTimeSheet(token, userId, date) {
  console.log(
    "🚀 ~ file: job.js ~ line 584 ~ getBiWeeklyTimeSheet ~ date",
    date
  );
  const states = store.getState();
  const url = "/job/getBiWeeklyTimeSheet";

  const processedToken = token ? token : states.authentication.token;

  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { userId, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + processedToken,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function saveBiWeeklyTimeSheet(data) {
  //jimmy
  const states = store.getState();
  const url = "/job/saveBiWeeklyTimeSheet";
  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function deleteOt(userId, date) {
  const states = store.getState();
  const url = "/job/deleteOt";

  return new Promise((resolve, reject) => {
    request
      .post(
        url,
        { userId, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Beaerer " + states.authentication.token,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}

export function bulkCreateJob(data) {
  const states = store.getState();
  const url = "/job/bulkCreateJob";

  return new Promise((resolve, reject) => {
    request
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Beaerer " + states.authentication.token,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}


export function submitBiWeeklyTimeSheetToAdmin (data,email){
  const states = store.getState();
  const url = "/job/submitBiWeeklyTimeSheetToAdmin"
  return new Promise((resolve, reject) => {
    request
      .post(url,data, {     
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Beaerer " + states.authentication.token,
        },
        
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("🚀 ~ file: job.js ~ line 709 ~ returnnewPromise ~ err", err)
        return reject(err)
      })
  });
}
