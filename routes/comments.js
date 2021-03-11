// COMMENTS
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const { Post, validatePost } = require("../models/post");
const { Comment } = require("../models/comment")
const {checkAuthenticated, checkNotAuthenticated} = require('../middleware/auth')


// create comment
router.post('/posts/addComment',checkAuthenticated, async(req, res) => {
    try {
      const commentId = mongoose.Types.ObjectId()
      const content = {
         _id : commentId, 
          username : req.body.username,
          email : req.body.email,  
          comment : req.body.comment,
      }

     await Post.updateOne(
        { _id : req.body.postId}, 
        { $push : { comments : content }}
      )

      await req.flash("success_msg", "Your comment has been updated successfully.");

    // Send socket message that new comment is created
     content.postId = req.body.postId
    req.app.io.emit('server:commentPosted', content);

    res.redirect("/posts/" + req.body.postId);

    } catch(err) {
      console.log(err)
    }
})



// reply the comment
router.post('/posts/replyComment',checkAuthenticated, async(req, res) => {
  try {
    // creating own reply id
    const replyId = mongoose.Types.ObjectId()

    // making obj for reply comment
    const content = {
      _id : replyId,
      name : req.body.name,
      reply : req.body.reply
    }

  // update post with comment
   await Post.updateOne({ 
     '_id' : req.body.postId, 
      'comments._id' : req.body.commentId
      }, { 
        $push : { 
          'comments.$.replies' : content
        }
      }
    )

    // Sending message with nodemailer
  //   let transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //         user: process.env.NODEMAILER_EMAIL, 
  //         pass: process.env.NODEMAILER_PASS
  //     }
  // });

  // let info = await transporter.sendMail({
  //     from: 'Node JS Blogging System 👻', 
  //     to: req.body.commentEmail, 
  //     subject: 'New Reply in Post 👻', 
  //     text: `${req.body.name} has replied your comment.
  //           View here  for details:      
  //            http://localhost:5000/posts/${req.body.postId}`
  // });

    await req.flash("success_msg", "Comment replied. Notifications has been sent to user on email.");

    // Send socket message that new comment is created
    req.app.io.emit('server:replycommentPosted', content);
    res.redirect("/posts/" + req.body.postId);

  } catch(err) {
    console.log(err)
  }
})



module.exports = router