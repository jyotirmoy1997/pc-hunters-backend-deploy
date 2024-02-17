const express = require("express");
const payment = require("../controllers/paymentController")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.ENDPOINT_SECRET // replace with your webhook secret key
const Cart = require("../model/Cart")
const { addNewOrder } = require("../controllers/OrderController")

const paymentRouter = express.Router()

paymentRouter.post("/", payment)

paymentRouter.post('/webhook', express.raw({type: '*/*'}), async (req, res) => {

    console.log("Webhook Invoked")
    const sig = req.headers['stripe-signature'];
    let event;
    let data;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      data = event.data.object
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  
    if (event.type === 'checkout.session.completed') {

      console.log("Payment Successfull")
      try {
        const customer = await stripe.customers.retrieve(data.customer)
        console.log("Customer Metadata :: ", customer.metadata)
        const {user} = customer.metadata
        const userCart = await Cart.findOne({user})
        console.log("User Cart :: ", userCart.products)

        addNewOrder(user, userCart.products)

        userCart.products.splice(0, userCart.products.length)
        userCart.count = 0
        userCart.total = 0

        await userCart.save()
        

      } catch (err) {
        console.log("Webhook Error :: ", err);
      }

      
    } else if (event.type === 'checkout.session.async_payment_failed') {
      console.log("Payment Cancelled")

      
    }

    res.sendStatus(200);
  });


module.exports = paymentRouter