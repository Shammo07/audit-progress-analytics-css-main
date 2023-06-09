import {getCatalogConnection, getTenantConnection, getTenantConfig } from "@/lib/db";
import tenantUserSchema from "@/models/Tenant/User";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
} from "@/lib/variables";
import jobSchema from "@/models/Tenant/Job";
import teamSchema from "@/models/Tenant/Team";
import catalogUserSchema from "@/models/User";
import mongoose from "mongoose"

export async function getAllUser(jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );
    let users = {};
    let userArray = [];
    let reqUserName = jwtUser.username;
    const tenantUser = tenantDB.model("User", tenantUserSchema);
    const user = await tenantUser.find({isSuperAdmin:false});
    const checkUserRight = await tenantUser.findOne({ username: reqUserName });

    if (checkUserRight.right[0].accessUserMgmt === false)
      throw { statusCode: HTTP_FORBIDDEN };

    if (user === "") throw { statusCode: HTTP_INTERNAL_SERVER_ERROR };

    if (user) {
      for (let i = 0; i < user.length; i++) {
        const id = user[i]._id;
        const name = user[i].name;
        const username = user[i].username;
        const initial = user[i].initial;
        const isActive = user[i].isActive;
    /*     const inactiveButton = username;
        const editButton = id; */

        users = {
          id: id,
          name: name,
          username: username,
          initial: initial,
          isActive: isActive,
   /*        inactiveButton: inactiveButton,
          editButton: editButton, */
        };
        userArray.push(users);

        users = {};
      }
    }
    return userArray;
  } catch (e) {
    throw e;
  }finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
}


export async function getUser(jwtUser) {
  const tenantObj = await getTenantConfig(jwtUser);
  const tenantDB = await getTenantConnection(
    tenantObj.databaseName,
    tenantObj.instanceUrl
  );

  const User = tenantDB.model("User", tenantUserSchema);
  const username = jwtUser.username;

  return new Promise((resolve, reject) => {
    User.findOne({ username }, "initial right isSuperAdmin -_id", function (err, person) {
      if (err) {
        tenantDB.close(function () {
          console.log("Mongoose connection Tenant Connection closed");
        });
        reject({ statusCode: HTTP_BAD_REQUEST });
      }else if (person) {
        resolve(person);
      }
    });
  })
  .finally(()=>{
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  })
}

export async function getUserDetail(id,jwtUser){
  const tenantObj = await getTenantConfig(jwtUser);
  const tenantDB = await getTenantConnection(
    tenantObj.databaseName,
    tenantObj.instanceUrl
  );

  const User = tenantDB.model("User", tenantUserSchema);
  return new Promise((resolve, reject) => {
    User.findOne({ _id:id },"initial right username name isActive _id", function (err, person) {
      if (person) {
        tenantDB.close(function () {
          console.log("Mongoose connection Tenant Connection closed");
        });
        resolve(person);
      }
      if (err) {
        console.error("🚀 ~ file: user.js ~ line 77 ~ err", err);
        tenantDB.close(function () {
          console.log("Mongoose connection Tenant Connection closed");
        });
        reject({ statusCode: HTTP_BAD_REQUEST });
      }
    });
  });


}

export async function getActiveUser(jwtUser) {
  try {
    const tenantObj = await getTenantConfig(jwtUser);
    var tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );

    let users = {};
    let userArray = [];
    const tenantUser = tenantDB.model("User", tenantUserSchema);

    const checkUserRight = await tenantUser.findOne({
      username: jwtUser.username,
    });

    if (checkUserRight.right[0].canSetJob === false)
    throw { statusCode: HTTP_FORBIDDEN };

    const user = await tenantUser.find({isActive:"Active"});
    if (user === "") throw { statusCode: HTTP_INTERNAL_SERVER_ERROR };
    if (user) {
      for (let i = 0; i < user.length; i++) {
        const id = user[i]._id
        const name = user[i].name;
        const initial = user[i].initial;

        users = {
          id: id,
          name: name,
          initial: initial,
        }
        userArray.push(users)

        users = {}
      }
    }
    return userArray;
  } catch (e) {
    throw e;
  }finally {
    tenantDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }

}

export async function getPosition(jwtUser,fileReference,isAdmin) {
    try{
      const tenantObj = await getTenantConfig(jwtUser);
      var tenantDB = await getTenantConnection(
        tenantObj.databaseName,
        tenantObj.instanceUrl
      );

    const tenantJob = tenantDB.model("Job", jobSchema);
    const tenantTeam = tenantDB.model("Team", teamSchema);
    const tenantUser = tenantDB.model("User", tenantUserSchema);

    let isLeader = [];

    if (fileReference) {
      //if A fileRef is provided, find member of the team only
      const team = await tenantJob.findOne({'fileReference': fileReference}).lean().populate({
        path: "teamId",
        populate: {path: "teamMember"}
      })

      if(isAdmin===true||team.teamId.teamLead.toString() === jwtUser.id){
        isLeader = team.teamId.teamMember;
      }
    } else {
      //else find all members among all teams of a person
      //this function is correct if a leader is always a leader.
      const team2 = await tenantTeam.find({"teamLead": new mongoose.Types.ObjectId(jwtUser.id)}).lean().populate({path: "teamMember"});
      if(team2 != null) {
        //this means the user is a leader, he can choose which person to look at.
        const buffer=[];
        for(let e of team2)
          for(let ee of e.teamMember)
            buffer.push(ee)
        isLeader = buffer;
      }
    }
    return isLeader
    }catch(error){
      console.log("🚀 ~ file: user.js ~ line 211 ~ getPosition ~ error", error)
      if (error.statusCode === HTTP_INTERNAL_SERVER_ERROR)
          return "Error Occurred" 
    else{
      return "Team leader not found" 
    }
    }finally {
      tenantDB.close(function () {
        console.log("Mongoose connection Tenant Connection closed");
      });
    }
   
}


export async function checkPermissionChange(jwtUser){
  try{
  const latestUserRight = await getUser(jwtUser)

  if(JSON.stringify(latestUserRight.right[0]) != JSON.stringify(jwtUser.userRight[0]))
    return true
  else
   return false
  }catch(error){
    return true
  }
}

export async function getCatalogSuperAdmin(jwtUser){

  try{
    var catalogDB = await getCatalogConnection();
    const catalogUser = catalogDB.model("User", catalogUserSchema);
    const username = jwtUser.username;
    const result = await catalogUser.findOne({username})
    if(result.isSuperAdmin!=undefined && result.isSuperAdmin===true){
      return true
    }else{
      return false
    }
  }catch(error){
    return false
  }finally {
    catalogDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }

}

