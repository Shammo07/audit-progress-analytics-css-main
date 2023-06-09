const mongoose = require("mongoose");
//const {switchDB} = require("../../lib/switchDB")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
  },
  initial: {
    type: String,
  },
  isActive:{
    type: String,
    default: "Active"
},
  right:[
    {
      accessUserMgmt:{type:Boolean,default:false},
      canViewAllJob:{type:Boolean,default:false},//for admin
      canViewJobList:{type:Boolean,default:false},
      canViewOwnJob:{type:Boolean,default:false},//for Team Leader
      canViewOwnJobForTeamMember:{type:Boolean,default:false},//for Team Leader
      canSetJob:{type:Boolean,default:false},
      canViewReport:{type:Boolean,default:false},//For Access OT Report For Leader and Approve OT
      canEditReport:{type:Boolean,default:false},//for Edit all 13.5
      canEditBiWeeklyTimeSheet:{type:Boolean,default:false},//for edit bi-weekly time sheet
      canEditEmailTemplate:{type:Boolean,default:false},//for edit email template
    }
  ],
  team:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref:"team",
  }],
  isSuperAdmin:{
    type:Boolean,
    default:false
  }
});


module.exports = userSchema
