const express = require('express')
const router = express.Router()
const {Category, vaidateCategory} = require('../models/category')
const {checkAuthenticated, checkNotAuthenticated} = require('../middleware/auth')

router.get('/categories/add', checkAuthenticated, async(req, res) => {

    try { 
        const categories = await Category.find()
        res.render('categories/addcategory.ejs', {
            categories : categories
        })
    }   catch(error) {
        console.log(error)
    }
})


router.post('/categories/add', async(req, res) => {
    const categories = await Category.find()

    const { error } = vaidateCategory(req.body)
  
    if(error) { 
       return res.render('categories/addcategory.ejs', {
            errors: error.details[0].message,
            categories : categories
        })
    }

    try {
        const category = new Category({
            cname : req.body.cname
        })
        await category.save()
        await req.flash('success_msg', "New category added")
        res.redirect('/categories/add')
    }   catch(error) {
          return res.render('categories/addcategory.ejs', {
            errors: error,
            categories : categories
          })
    }
})

module.exports = router