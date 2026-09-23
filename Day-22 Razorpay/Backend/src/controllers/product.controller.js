const prodcutModel = require("../model/product.model");

async function createProduct(req, res) {
  const {
    image,
    title,
    description,
    category,
    price: { amount, currency },
  } = req.body;

  try {
    const product = await prodcutModel.create({
      image,
      title,
      description,
      category,
      price: { amount, currency },
    });

    return res.status(201).json({
      message: "Product created Successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getProducts(req,res) {
  try {
    const product = await prodcutModel.findOne();
    return res.status(200).json({
      message: "Products fethced successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
};
