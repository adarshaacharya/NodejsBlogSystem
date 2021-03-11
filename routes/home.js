const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const {Post} = require('../models/post')
 
const {checkAuthenticated, checkNotAuthenticated} = require('../middleware/auth')
  
router.get('/', checkNotAuthenticated, (req, res) => {
   try {
        res.render('index.ejs')
   }    catch(err) {
       console.log(err)
   }
})


router.get('/api/posts', checkAuthenticated, async (req, res) => {  
    try {
        const posts = await Post.find().sort('-date')
        res.json(posts)
    }   catch(err) {
        console.log(err)
    }
})






module.exports = router