const mongoose = require("mongoose");
const Joi = require("@hapi/joi");


const replyCommentSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  reply: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10000
  },
  date : {
    type: Date,
    default: Date.now
  }
});

const replyComment = mongoose.model('replyComment', replyCommentSchema)

// exporting Schema
module.exports.replyCommentSchema = replyCommentSchema 

// exporting Model
module.exports.replyComment = replyComment


