const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please provide a name'],
        minlength : [3, 'Name cannot be less than 3 characters'],
        maxlength : [50, 'Name cannot be more than 50 characters']
    },
    price : {
        type : Number,
        required : [true, 'Please provide a price'],
        default : 0
    },
    description : {
        type : String,
        required : [true, 'Please provide a description'],
        maxlength : [1000, 'Description cannot be more than 1000 characters']
    },
    image : {
        type : String
    },
    category : {
        type : String,
        required : true
    },
    inventory :{
        type : Number,
        default : 15
    },
}, {timestamps : true })


module.exports = mongoose.model("Product", ProductSchema)