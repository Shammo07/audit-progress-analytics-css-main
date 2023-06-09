const HTTP_OK=200
const HTTP_NO_CONTENT=204
const HTTP_INTERNAL_SERVER_ERROR=500
const HTTP_BAD_REQUEST=400
const HTTP_UNAUTHORIZED=401
const HTTP_FORBIDDEN=403
const HTTP_METHOD_NOT_ALLOWED=405

const SALT_ROUNDS=10

// todo fetch all tenant data on the server starts
// todo auto update the tenant data in a period of time (using setInterval, maybe)
// todo the object should looks like this:
// "626bb177f2ff5331111c4051":{
//    "username": "AlvinLau",
//      "password": "12345678",
//      "databaseName": "TenantA",
//      "instanceUrl": "mongodb+srv://AlvinLau:test1234@cluster0.gcb4d.mongodb.net/",
//      "isLocal": true,
// }

const TENANTS={
   /*"626bb177f2ff5331111c4051":{
      "username": "AlvinLau",
      "password": "12345678",
      "databaseName": "TenantA",
      "instanceUrl": "mongodb+srv://AlvinLau:test1234@cluster0.gcb4d.mongodb.net/",
      "isLocal": true,
   }*/
}

const REFRESH_TOKENS=[];

export {
   HTTP_OK,
   HTTP_NO_CONTENT,
   HTTP_INTERNAL_SERVER_ERROR,
   HTTP_BAD_REQUEST,
   HTTP_UNAUTHORIZED,
   HTTP_FORBIDDEN,
   HTTP_METHOD_NOT_ALLOWED,
   SALT_ROUNDS,
   TENANTS,
   REFRESH_TOKENS
 }
