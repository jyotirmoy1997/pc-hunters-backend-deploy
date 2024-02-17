const express = require("express")
const { getAllOrders } = require("../controllers/OrderController")
const { authenticateUser } = require('../middleware/authentication');

const orderRouter = express.Router()

orderRouter.get("/getAllOrders/:userId", authenticateUser, getAllOrders)


module.exports = orderRouter