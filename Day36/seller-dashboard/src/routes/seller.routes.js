const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const controller = require("../controllers/seller.controller")
const router = express.Router()

router.get("/metrics",authMiddleware(["seller"]),controller.getMetrics)
router.get("/orders",authMiddleware(["seller"]),controller.getOrders)
router.get("/products",authMiddleware(["seller"]),controller.getProducts)



module.exports = router;
