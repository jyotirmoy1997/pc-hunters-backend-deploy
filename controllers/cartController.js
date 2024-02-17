const Cart = require("../model/Cart")
const Product = require("../model/Product")

const getAllCartItems = async (req, res) => {
    const {userId} = req.params

    try {
      const cart = await Cart.findOne({user : userId})
      if(cart === null){
        return res.status(200).json({ products : [], count : 0, total : 0})
      }
      else{
        return res.status(200).json(cart)
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error" })
    }
}

const addCartItem = async (req, res) => {
  const userId = req.body.user

  if(userId !== req.user.userId){
    return res.status(401).json({ error: "Not Authorized" })
  }
  const productId = req.body.product
  const quantity = req.body.quantity || 1

  const productPrice = (await Product.findOne({_id : productId})).price
  try {
    let cart = await Cart.findOne({ user: userId })

    if (cart) {
      // If cart exists, push the new product to the products array
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      )

      if (productIndex > -1) {
        // If product exists in the cart, increase its quantity
        cart.products[productIndex].quantity += quantity
      } else {
        // If product does not exist in the cart, add it to the products array
        cart.products.push({ product: productId, quantity })
      }
      
    }
    else {
      // If cart does not exist, create a new cart and add the product to it
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }]
      })
    }
    cart.total += productPrice * quantity
    cart.count += quantity
    // Save the cart and return the updated cart as the response
    await cart.save()
    // console.log(cart)
    return res.status(201).json(cart)
  } catch (err) {
    // console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
    
}

const updateCartItem = async (req, res) => {

  const {user, product, operation} = req.body
  if(user !== req.user.userId){
    return res.status(401).json({ error: "Not Authorized" })
  }
  const productPrice = (await Product.findOne({_id : product})).price
  try {
    let cart = await Cart.findOne({ user: user })
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === product
    )

    if (productIndex > -1) {
      if(operation === "increment"){
        cart.products[productIndex].quantity++
        cart.count++
        cart.total += productPrice
      }
      else if(operation === "decrement"){
        cart.products[productIndex].quantity--
        cart.count--
        cart.total -= productPrice
      }
      if(cart.products[productIndex].quantity === 0){
        cart.products.splice(productIndex, 1)
      }
      await cart.save()
      // console.log(cart)
      return res.status(200).json(cart)
      
    } else {
      // console.log("Product Does Not Exist")
      return res.status(500).json({ error: "Server error" })
    }
    
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ error: "Server error" })
  }
}

const removeCartItem = async (req, res) => {
  // console.log("Hit")
  const {user, product} = req.body
  if(user !== req.user.userId){
    return res.status(401).json({ error: "Not Authorized" })
  }
  const productPrice = (await Product.findOne({_id : product})).price
  // console.log(productPrice)
  // res.send("Okay")
  try {
    let cart = await Cart.findOne({ user: user })
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === product
    )

    if (productIndex > -1) {
      cart.count -= cart.products[productIndex].quantity
      cart.total -= productPrice * cart.products[productIndex].quantity
      cart.products.splice(productIndex, 1)
      await cart.save()
      return res.status(200).json(cart)
      
    } else {
      // console.log("Product Does Not Exist")
      return res.status(500).json({ error: "Server error" })
    }
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ error: "Server error" })
  }
  

}

module.exports = {getAllCartItems, addCartItem, removeCartItem, updateCartItem}