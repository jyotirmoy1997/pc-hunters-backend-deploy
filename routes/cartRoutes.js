const express = require("express")
const { getAllCartItems, addCartItem, removeCartItem, updateCartItem } = require("../controllers/cartController")
const { authenticateUser } = require('../middleware/authentication');

const cartRouter = express.Router()

cartRouter.get("/getAllCartItems/:userId", authenticateUser,  getAllCartItems)
cartRouter.post("/addCartItem", authenticateUser, addCartItem)
cartRouter.patch("/updateCartItem", authenticateUser, updateCartItem)
cartRouter.delete("/removeCartItem", authenticateUser, removeCartItem)

module.exports = cartRouter