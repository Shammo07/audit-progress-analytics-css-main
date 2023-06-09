const mongoose  = require('mongoose')

const tenantSchema =  new mongoose.Schema({
    username:{
        type:String,
        trim: true,
        required:[true,"Username is required"],
        unique:true,
    },
    password:{
        type:String,
        trim: true,
        required:[true,"Password is required"],
        min:[7,"Must more than 7"],
    },
    databaseName:{
        type:String,
    },
    instanceUrl:{
        type:String,
    },
    isLocal:{
        type:Boolean,
    },
    companyName:{
        type:String,
    },
    logo:{
        type:String,
    }
})

// const Tenant = mongoose.model('Tenant', tenantSchema)

module.exports = tenantSchema;
