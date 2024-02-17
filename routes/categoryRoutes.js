const express = require("express")
const {getAllCategories} = require("../controllers/categoriesController")

const categoriesRouter = express.Router()

categoriesRouter.get('/getAllCategories', getAllCategories)


module.exports = categoriesRouter