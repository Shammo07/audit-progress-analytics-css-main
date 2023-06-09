import nextConnect from "next-connect";
import {getDefaultOptions} from "@/lib/nextConnect";
import catalogUserSchema from "@/models/User";
import catalogTenantSchema from "@/models/Tenant";
import refreshTokenSchema from "@/models/Tenant/RefreshToken"
import {getCatalogConnection, getTenantConfig, getTenantConnection} from "@/lib/db";
import {HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_UNAUTHORIZED, REFRESH_TOKENS} from "@/lib/variables";
import userSchema from "@/models/Tenant/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const apiRoute = nextConnect(getDefaultOptions());


apiRoute.post(async (req, res) => {
  try {
    var catalogDB = await getCatalogConnection();
    const User = catalogDB.model("User", catalogUserSchema);
    const Tenant = catalogDB.model("tenant", catalogTenantSchema);

    const { username, password, isRemember } = req.body

    const user = await User.findOne({ username }).lean().populate('tenant','databaseName instanceUrl _id logo companyName')
    const tenantObj = await getTenantConfig(user)
    const tenantDB = await getTenantConnection(
      tenantObj.databaseName,
      tenantObj.instanceUrl
    );
    const tenantUser = tenantDB.model("User", userSchema);
    const refreshTokenDB = tenantDB.model("RefreshToken", refreshTokenSchema);
    const tenantUserData = await tenantUser.findOne({username:username})
    if (!user || !tenantUserData) {
      throw {statusCode:HTTP_UNAUTHORIZED};
    }

    if(user.isActive === "Inactive")
      throw {statusCode:HTTP_FORBIDDEN};

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare && isRemember) {
      const accessToken = jwt.sign(
        {
          userRight:tenantUserData.right,
          catalogUserId: user._id,
          id:tenantUserData._id,
          username: user.username,
          tenantId: user.tenant._id,
          initial: user.initial,
          name:user.name
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "30m",
        }
      );
      const refreshToken = jwt.sign(
        {
          userRight:tenantUserData.right,
          catalogUserId: user._id,
          id:tenantUserData._id,
          username: user.username,
          tenantId: user.tenant._id,
          initial: user.initial,
          name:user.name
        },
        process.env.REFRESH_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "30d",
        }
      )
      REFRESH_TOKENS.push(refreshToken)
      refreshTokenDB.create({ refreshToken: refreshToken });
      return res.json({ username, token: accessToken , refreshToken:refreshToken ,right:tenantUserData.right,logo:user.tenant.logo,companyName:user.tenant.companyName,isSuperAdmin:user.isSuperAdmin});
    } else if (passwordCompare) {
      const accessToken = jwt.sign(
        {
          userRight:tenantUserData.right,
          catalogUserId: user._id,
          id:tenantUserData._id,
          username: user.username,
          tenantId: user.tenant._id,
          initial: user.initial,
          name:user.name
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "15m",
        }
      );
      const refreshToken = jwt.sign(
        {
          userRight:tenantUserData.right,
          catalogUserId: user._id,
          id:tenantUserData._id,
          username: user.username,
          tenantId: user.tenant._id,
          initial: user.initial,
          name:user.name
        },
        process.env.REFRESH_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1d",
        }
      )
      REFRESH_TOKENS.push(refreshToken)
      refreshTokenDB.create({ refreshToken: refreshToken });

      return res.json({ username, token: accessToken , refreshToken:refreshToken ,right:tenantUserData.right,logo:user.tenant.logo,companyName:user.tenant.companyName,isSuperAdmin:user.isSuperAdmin});
    } else {
      throw { statusCode: HTTP_BAD_REQUEST };
    }
  } catch (error) {
    console.error(error);
    if(error.statusCode===HTTP_UNAUTHORIZED){
      return res.status(error.statusCode).json({error: "Invalid username/password" });
    }else if(error.statusCode===HTTP_BAD_REQUEST){
      return res.status(error.statusCode).json({error: "Check the password again" });
    }else if(error.statusCode===HTTP_FORBIDDEN){
      return res.status(error.statusCode).json({error: "Your account is inactive" });
    }
    return res.status(HTTP_UNAUTHORIZED).json({ error: "You are not authorized" });
  }finally {
    catalogDB.close(function () {
      console.log("Mongoose connection Tenant Connection closed");
    });
  }
})


export default apiRoute;

export const config = {
  api: {
    bodyParser: true,
  },
};
