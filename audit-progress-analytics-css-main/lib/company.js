import {getCatalogConnection, getTenantConfig, getTenantConnection} from "@/lib/db";
import catalogUserSchema from "@/models/User";
import tenantUserSchema from "@/models/Tenant/User";
import tenantSchema from "@/models/Tenant";
import {
    HTTP_BAD_REQUEST,
    HTTP_FORBIDDEN,
    HTTP_INTERNAL_SERVER_ERROR,
  } from "@/lib/variables";

export async function getCompanySetting (jwtUser){
    try{
        var catalogDB = await getCatalogConnection();
        const tenant = catalogDB.model("Tenant", tenantSchema);
        const catalogUser = catalogDB.model("User",catalogUserSchema)

        const getCatalogUserDetail = await catalogUser.findOne({username:jwtUser.username})
        return new Promise((resolve,reject)=>{
            tenant.findOne({_id:getCatalogUserDetail.tenant},"logo companyName",function(err,company){
                if(company)
                    resolve(company)
                if(err)
                    reject({ statusCode: HTTP_BAD_REQUEST })
            })
        })

    }catch(error){
        console.log("🚀 ~ file: company.js:28 ~ getCompanySetting ~ error", error)
        throw(error)
    }finally{
        catalogDB.close(function () {
            console.log("Mongoose connection Tenant Connection closed");
          });
    }
}