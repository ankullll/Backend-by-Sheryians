const express = require("express");
const app = require("../app");
const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");
const validation = require("../middlewares/validation.middleware");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware(["user"]),
  validation.createOrderValidation,
  orderController.createOrder,
);

router.get("/me",createAuthMiddleware(["user"]),orderController.getMyOrders)

router.post("/:id/cancel",createAuthMiddleware(["user"]),orderController.cancelOrderById)

router.patch("/:id/address",createAuthMiddleware(["user"]),validation.updateAddressValidation,orderController.updateOrderAddress)

router.get("/:id",createAuthMiddleware(["user","admin"]),orderController.getOrderById)

module.exports = router;
