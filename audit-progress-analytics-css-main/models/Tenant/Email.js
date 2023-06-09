const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  subject: {
    type: String
  },
  content: {
    type: String
  }
});

module.exports = mailSchema;