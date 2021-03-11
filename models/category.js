const mongoose = require("mongoose")
const Joi = require("@hapi/joi")


const categorySchema = new mongoose.Schema({
    cname : {
        type: String,
        minlength: 2,
        maxlength: 20,
        unique: true,
        required : true
    }
})

const Category = mongoose.model('Category', categorySchema)

function vaidateCategory(category) {
    const schema = Joi.object({
        cname : Joi.string().required().min(3).max(20),
    })

    return schema.validate(category);
}

module.exports.Category = Category
module.exports.vaidateCategory = vaidateCategory


// checking for unique category
categorySchema.path('cname').validate(async (value) => {
    const categoriesCount = await mongoose.models.Category.countDocuments({cname: value });
    return !categoriesCount;
  }, 'The given category already exists.');


