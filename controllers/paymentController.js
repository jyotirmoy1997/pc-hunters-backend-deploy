require("dotenv").config()
const Product = require("../model/Product")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



const payment = async (req, res) => {
        
        const {user, products} = req.body
        // console.log(products)

        try {
            const allProducts = await Product.find({});
            const productsToPurchase = products.reduce((acc, prod) => {
              const matchingProduct = allProducts.find(p => p._id.toString() === prod.product.toString());
              if (matchingProduct) {
                acc.push({...prod, price : matchingProduct.price, name : matchingProduct.name});
              }
              return acc;
            }, []);

            

            const customer = await stripe.customers.create({
                metadata : {
                    user,
                    products : JSON.stringify(products)
                }
            })
            
            const session = await stripe.checkout.sessions.create({
                        payment_method_types : ['card'],
                        mode : 'payment',
                        success_url : 'https://pc-hunterz.netlify.app/payment',
                        cancel_url : 'https://pc-hunterz.netlify.app/checkout',
                        customer : customer.id,
                        line_items : productsToPurchase.map((product) => {
                            return {
                                price_data : {
                                    currency : 'inr',
                                    product_data : {
                                        name : product.name
                                    },
                                    unit_amount : product.price * 100
                                },
                                quantity : product.quantity
                            }
                        })
                    })
            
            // console.log(session.url)
            console.log("Payment Hit")
            res.status(200).json({url : session.url})
        }
        catch(err){
            console.log("Error !" + err)
        }
    }




module.exports = payment