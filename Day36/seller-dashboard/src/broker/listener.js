const { subscribeToQueue } = require("./broker");
const userModel = require("../models/user.model");
const productmodel = require("../models/product.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

module.exports = async function () {
  subscribeToQueue(
    "AUTH_SELLER_DASHBOARD.USER_CREATED",
    subscribeToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", async (user) => {
      await userModel.create(user);
    }),
  );

  subscribeToQueue(
    "PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED",
    async (product) => {
      await productmodel.create(product);
    },
  );

  subscribeToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", async (order) => {
    await orderModel.create(order);
  });

  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED",
    async (payment) => {
      await paymentModel.create(payment);
    },
  );
  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE",
    async (payment) => {
      await paymentModel.findOneAndUpdate(
        { orderId: payment.orderId },
        { ...payment },
      );
    },
  );

  subscribeToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", async (data) => {
    const emailHTMLTemplate = `
        <h1>New Product Available!</h1>
        <p>Dear ${data.username},</p>
        <p>Check it out and enjoy exclusive launch offers!</p>
        <p>Best regards,<br/>The Team</p>
        `;
    await sendEmail(
      data.email,
      "New Product Launched",
      "Check out our latest product",
      emailHTMLTemplate,
    );
  });
};
