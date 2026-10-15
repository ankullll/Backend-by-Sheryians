const express = require("express");
const app = require("../app");
const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");
const validation = require("../middlewares/validation.middleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware(["user"]),
  validation.createOrderValidation,
  orderController.createOrder,
);

module.exports = router;
