const Categories = require("../model/Categories")
const Product = require("../model/Product")

// const uploadCategories = async (req, res) => {
//   try {
//     const categories = await Categories.find({})
//     const products = await Product.find({})

//     // Group products by category
//     const groupedProducts = products.reduce((groups, product) => {
//       if (!groups[product.category]) {
//         groups[product.category] = [];
//       }

//       groups[product.category].push(product);

//       return groups;
//     }, {});
//     console.log(groupedProducts)

//     // Update categories with products
//     // for (const category of categories) {
//     //   const categoryName = category.name;
//     //   const categoryProducts = groupedProducts[categoryName] || [];

//     //   await Categories.findOneAndUpdate(
//     //     { _id: category._id },
//     //     { $set: { products: categoryProducts } }
//     //   );
//     // }

//     res.send("Products updated for all categories.");
//   } catch (error) {
//     console.log(error)
//     res.status(500).send("Error updating products for categories.");
//   }
// }

const getAllCategories = async (req, res) => {
    try {
      const categories = await Categories.find({})
      res.status(200).json(categories)
    } catch (error) {
      res.status(404).send("Resource Not Found");
    }
}

module.exports = { getAllCategories }
