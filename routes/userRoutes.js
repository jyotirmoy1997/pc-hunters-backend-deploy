const userRouter = require("express").Router()
const { getAllUsers } = require("../controllers/userController")
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

userRouter.get("/getAllUsers", authenticateUser, authorizePermissions('admin'),  getAllUsers)


module.exports = userRouter