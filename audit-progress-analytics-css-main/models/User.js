const mongoose  = require('mongoose')

const userSchema = new  mongoose.Schema({
    username:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        trim: true,
        required:[true,"Password is required"],
        min:[7,"Must more than or equal to 8"],
    },
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tenant'
    },
    isActive:{
        type: String,
        default: "Active"
    },
    isSuperAdmin:{
        type:Boolean,
        default:false
      }
})

// const User = mongoose.model('User', userSchema)
module.exports = userSchema;
