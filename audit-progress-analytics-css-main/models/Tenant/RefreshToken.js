const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    refreshToken:{
        type:String,
        unique: true,
    }
})

module.exports = refreshTokenSchema