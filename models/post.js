const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {commentSchema} = require('./comment')


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref : 'Category'
  },
  author: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  body: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 10000
  },
  mainImage: {
    type: Buffer,
    required: true
  },
  mainImageType: {
    type : String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments : {
   type : [commentSchema] // embedding comment Schema inside 
  }
});


postSchema.virtual('mainImagePath').get(function() {
    if (this.mainImage != null && this.mainImageType != null) {
      return `data:${this.mainImageType};charset=utf-8;base64,${this.mainImage.toString('base64')}`
    }
})


const Post = mongoose.model("Post", postSchema);


function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(50)
      .required(),
    category: Joi.string()
      .min(3)
      .max(50)
      .required(),
    author: Joi.string()
      .min(3)
      .max(50)
      .required(),

      body: Joi.string()
      .min(20)
      .max(10000)
      .required(),

      mainImage : Joi.any().required()
  });

  return schema.validate(post); 
}


module.exports.Post = Post;
module.exports.validatePost = validatePost;
