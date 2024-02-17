const productRoutes = require("express").Router()

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController")


productRoutes.get("/getAllProducts", getAllProducts)
productRoutes.post("/createProduct", createProduct)
productRoutes.patch("/:id", updateProduct)
productRoutes.delete("/:id", deleteProduct)

module.exports = productRoutes