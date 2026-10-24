const { default: axios } = require("axios");
const orderModel = require("../models/order.model");
const {publishToQueue} = require("../broker/broker")

async function createOrder(req, res) {
  const user = req.user;

  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    // fetch user cart from cart service
    const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await Promise.all(
      cartResponse.data.cart.items.map(async (item) => {
        const response = await axios.get(
          `http://localhost:3001/api/products/${item.productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data.data;
      }),
    );

    let priceAmount = 0;

    const orderItems = cartResponse.data.cart.items.map((item, index) => {
      const product = products.find((p) => p._id === item.productId);

      // if not in stock , does not allow order creation
      if (!product.stock || product.stock < item.quantity) {
        throw new Error(
          `Product ${product.title} is out of stock or insufficient stock`,
        );
      }

      const itemTotal = product.price.amount * item.quantity;
      priceAmount += itemTotal;

      return {
        product: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency,
        },
      };
    });

    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalPrice: {
        amount: priceAmount,
        currency: "INR",
      },
      shippingAddress: {
        street: req.body.shippingAddress.street,
        city: req.body.shippingAddress.city,
        state: req.body.shippingAddress.state,
        zip: req.body.shippingAddress.pincode,
        country: req.body.shippingAddress.country,
      },
    });

    await publishToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED",order)

    res.status(201).json({
      order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function getMyOrders(req, res) {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel.find({user:user.id})
    const totalOrders  =  await orderModel.countDocuments({user:user.id})

    return res.status(200).json({
      orders,
      meta:{
        total:totalOrders,
        page,limit
      }
    })
  } catch (error) {
    return res.status(500).json({message:"Internal server error"})
  }
}


async function getOrderById(req,res){
  const user = req.user;
  const orderId = req.params.id;

  try {
    
    const order = await orderModel.findById(orderId )

    if(!order){
      return res.status(404).json({message:"Order not found"});
    }

    if(order.user.toString() !== user.id){
      return res.status(403).json({message:"Forbidden : You dont have access to this order"})
    }

    return res.status(200).json({order})

  } catch (error) {
    return res.status(500).json({message:"Internal server error"})
  }

}


async function cancelOrderById(req,res) {
  
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId)


    if(!order){
      return res.status(404).json({message:"Order not found"})
    }

    if(order.user.toString() !== user.id){
      return res.status(403).json({message: "Forbidden: You do not have access to this order"})
    }

    // only pending orders cancel kar skte h
    if(order.status !== "PENDING"){
      return res.status(409).json({message:"Order cannot be cancelled at this stage" }) 
    }

    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({order})
  } catch (error) {
    return res.status(500).json({message:"Internal server error"})
  }
}

async function updateOrderAddress(req,res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if(!order){
      return res.status(404).json({message:"Order not found"})
    }

    if(order.user.toString() !== user.id){
      return res.status(403).json({message: "Forbidden: You do not have access to this order"})
    }
    
    // sirf pending order ka address change kar skte hai ham
    if(order.status !== "PENDING"){
      return res.status(409).json({message:"Order cannot be updated at this stage"});
    }

    order.shippingAddress = {
      street:req.body.shippingAddress.street,
      city:req.body.shippingAddress.city,
      state:req.body.shippingAddress.state,
      zip:req.body.shippingAddress.pincode,
      country:req.body.shippingAddress.country,
    }
    await order.save()

    return res.status(200).json({order})
  } catch (error) {
    return res.status(500).json({message:"Internal server error"})
  }
}

module.exports = { createOrder, getMyOrders,getOrderById,cancelOrderById,updateOrderAddress };
