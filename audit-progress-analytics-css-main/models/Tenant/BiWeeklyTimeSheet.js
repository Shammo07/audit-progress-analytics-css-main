const mongoose = require("mongoose");

const biWeeklyTimeSheetSchema = new mongoose.Schema({
    doneBy:{
        type: mongoose.Schema.Types.ObjectId
    },
    sheets:[{
        submitDate: Date,
        clientName: Array,
        pic:Array,
        code:Array,
        hours:{ type : Array },
        tableBData:Array,
        tableCData:Array,
        tableDData:Array,
        approvedUnits: Array,
        tableBOther:String,
        tableCOther:String,
        tableDOther:String,
        teamInitial:String,
        submitted:{type: Boolean, default:false}

    }]

}, {_id: false});

module.exports = biWeeklyTimeSheetSchema;
