const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { replyCommentSchema } = require('./replycomment')

const commentSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email : {
    type : String,
    required : true,
    minlength : 5,
    maxlength : 255
  },
  comment: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10000
  },
  date : {
    type: Date,
    default: Date.now
  },
  replies : {
    type :  [replyCommentSchema] // embedding replycomment schema inside commentSchema
   } 
});

const Comment = mongoose.model('Comment', commentSchema)

module.exports.commentSchema = commentSchema 

module.exports.Comment = Comment


