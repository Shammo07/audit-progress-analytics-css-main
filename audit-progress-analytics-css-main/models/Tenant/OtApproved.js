const mongoose = require("mongoose");

const otApprovedSchema = new mongoose.Schema({
    doneBy:{
        type: mongoose.Schema.Types.ObjectId
    },
    otActivities: [{
        submitDate: Date,

        details: [
            {
                dates: Date,
                approvedUnits: Number,
                fileReference: Array,
                client: Array
            }
        ]
    }
    ]

}, {_id: false});

module.exports = otApprovedSchema;
