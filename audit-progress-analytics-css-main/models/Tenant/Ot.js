const mongoose = require("mongoose");

const otSchema = new mongoose.Schema({
    doneBy:{
        type: mongoose.Schema.Types.ObjectId
    },
    otActivities: [
        {
            dates: Date,
            fileReference: Array,
            client: Array,
            units: Array,
            approvedUnits: {type: Number,default:null},
            comments: {type: String, default: null},
            teamLeader: Array
    },]


}, {_id: false});

module.exports = otSchema;
