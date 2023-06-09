const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

  teamMember:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  teamLead:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  teamDirector:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  }
});

module.exports = teamSchema;
