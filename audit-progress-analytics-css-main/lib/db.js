import mongoose from 'mongoose';
import {TENANTS} from './variables'
import catalogTenantSchema from "models/Tenant"

export function getDBConnection(url) {
  return new Promise((resolve, reject) => {
    const connection = mongoose
      .createConnection(url, { useNewUrlParser: true })
      .asPromise();
    resolve(connection);
  });
}

export function getCatalogConnection() {
  return new Promise(async(resolve, reject) => {
    const connection = await getDBConnection(process.env.DATABASE_URL + process.env.DATABASE_NAME+"?authSource=admin")

    await connection
      .useDb("Catalog",{useCache:true,noListener: true})
    resolve(connection);
  });
}

export function getTenantConnection(dbName,dbUrl,isLocal){
  return new Promise(async(resolve,reject)=>{
    let connection = await getDBConnection(dbUrl+"?authSource=admin")

    let tenantDb = connection.useDb(dbName,{useCache:true,noListener: true});
    resolve(tenantDb)
  })
}

//TODO set this to lib and if undefined run this
export async function queryDatabase() {
  return getCatalogConnection()
    .then(async function (catalogDB) {
       const Tenant = catalogDB.model("tenant", catalogTenantSchema);
       const tenantList = await Tenant.find({});
       tenantList.map(function (item) {
         let id = item._id;
         let username = item.username;
         let password = item.password;
         let databaseName = item.databaseName;
         let instanceUrl = item.instanceUrl;
         let isLocal = item.isLocal;
         TENANTS[id]={
           "username": username,
           "password": password,
           "databaseName": databaseName,
           "instanceUrl": instanceUrl,
           "isLocal": isLocal,
         }
       });
    });
}

export async function getTenantConfig(user) {
  let tenantObj
  if(user.tenant&&user.tenant._id){
    tenantObj=TENANTS[user.tenant._id];
  }else{
    tenantObj=TENANTS[user.tenantId];
  }
  if(!tenantObj){
    await queryDatabase()
    if(user.tenant&&user.tenant._id){
      tenantObj=TENANTS[user.tenant._id];
    }else{
      tenantObj=TENANTS[user.tenantId];
    }
  }

  return tenantObj
}


// module.exports={getCatalogConnection,getTenantConnection,queryDatabase}
