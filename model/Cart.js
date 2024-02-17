const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
            },
            quantity : {
                type : Number,
                default : 0
            }
        }
    ],
    count : {
        type : Number,
        default : 0
    },
    total : {
        type : Number,
        default : 0
    }
})

module.exports = mongoose.model("Cart", CartSchema)