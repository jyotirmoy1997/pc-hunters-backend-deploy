const Order = require("../model/Order")
const Product = require("../model/Product")

const addNewOrder = async (user, productsArray) => {
    const products = productsArray.slice()
    try {
        const userOrder = await Order.findOne({user : user})
        if(!userOrder){
            console.log("Inside If Block :: ", user, products)
            const newUserOrder = await Order.create({user : user, products : products})
        }
        else{
            console.log("Inside Else block")
            const userOrderMap = new Map()
            const existingProducts = userOrder.products
            for(let i=0; i<existingProducts.length; i++){
                userOrderMap.set(existingProducts[i].product.toString(), i);
            }

            for(let item of products){
                if(userOrderMap.has(item.product)){
                    const index = userOrderMap.get(item.product)
                    userOrder.products[index].quantity += item.quantity
                }
                else{
                    userOrder.products.push(item)
                }
            }
            await userOrder.save()
        }
    } catch (error) {
        console.log("Order Error :: ", error)
    }
}

const getAllOrders = async(req, res) => {
    const { userId } = req.params
    try {
        const userOrder = await Order.findOne({user : userId})
        if(!userOrder){
            return res.status(200).json({orders : []})
        }
        else{
            const allProducts = await Product.find({})
            let products = []

            for(let it1 of userOrder.products){
                for(let it2 of allProducts){
                    if(it1.product.toString() === it2._id.toString()){
                        products.push({
                                image : it2.image, 
                                description : it2.description,
                                name : it2.name,
                                quantity :it1.quantity
                            })
                    }
                }
            }
            console.log(products)
                    
            return res.status(200).json({orders : products})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg : "Internal Server Error"})
    }
}


module.exports = {addNewOrder, getAllOrders}
