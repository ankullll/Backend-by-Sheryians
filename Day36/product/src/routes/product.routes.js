const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createProduct,getProducts,getProductById,updateProduct,deleteProduct,getProductBySeller } = require("../controllers/product.controller");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const {createProductValidators} = require("../validators/product.validators")


const upload = multer({ storage: multer.memoryStorage() });
// POST /api/products/
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidators,
  createProduct
);


// GET /api/products
router.get("/",getProducts)




// PATCH /api/products/:id
router.patch("/:id",createAuthMiddleware(["seller"]),updateProduct)
// DELETE /api/products/:id
router.delete("/:id",createAuthMiddleware(["seller"]),deleteProduct)

// GET /api/product/seller 
router.get("/seller",createAuthMiddleware(["seller"]),getProductBySeller)

// GET /api/products/:id  ======> isko niche isliye likha h kyuki upar likhte to /seller wali id iske badle kam krne lagti
router.get("/:id",getProductById)
module.exports = router;
