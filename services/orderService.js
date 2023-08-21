const expressAsyncHandler = require("express-async-handler");
const cartModule = require("../modules/cartModule");
const productsModel = require("../modules/productsModule");
const orderModule = require("../modules/orderModule");
const texesModule = require("../modules/texesModule");
const apiError = require("../utils/apiError");

// @desc      Create Order on my cart
// @ruote     PUT /api/v1/order
// @access    Private/user
const createOrderCash = expressAsyncHandler(async (req, res, next) => {
  const texes = await texesModule.findOne({});
  const texPrice = texes.texPrice;
  const shippingPrice = texes.shippingPrice;
  // 1) Get cart by user id
  const cart = await cartModule.findOne({ user: req.user._id });
  if (!cart || cart.cartItems.length === 0) {
    return res.status(404).json({
      status: "Error",
      message: "you not have cart now you can add product.",
    });
  }
  // 2) Get total price if in discount then get total price after discount and insert new order
  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = totalPrice + texPrice + shippingPrice;
  // - insert new order
  const order = await orderModule.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    paymentMethodType: "cash",
    texPrice,
    shippingPrice,
    isPaid: false,
    isDeliverd: false,
    shippingAddress: req.body.shippingAddress,
  });

  // 3) Update quantity and sold
  const bulkOption = cart.cartItems.map((product) => ({
    updateOne: {
      filter: { _id: product.productId },
      update: {
        $inc: { quantity: -product.quantity, sold: +product.quantity },
      },
    },
  }));
  await productsModel.bulkWrite(bulkOption, {});
  // 4) clear Cart User
  await cartModule.findOneAndDelete({ user: req.user._id });
  res
    .status(201)
    .json({ message: "saccss", payment_method_type: "cash", data: order });
});

// @desc      Get Orders
// @ruote     GET /api/v1/order
// @access    Private/Admin-Manger
const getOrders = expressAsyncHandler(async (req, res, next) => {
  const orders = await orderModule
    .find({})
    .populate({ path: "user", select: "name phone email" })
    .populate({
      path: "cartItems.productId",
      select: "title description quantity sold",
    });
  res
    .status(200)
    .json({ message: "All Orders", count_orders: orders.length, data: orders });
});

// @desc      Get Single Order
// @ruote     GET /api/v1/order/:orderId
// @access    Private/Admin-Manger-User
const getSingleOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await orderModule
    .findById(req.params.orderId)
    .populate({ path: "user", select: "name phone email" })
    .populate({
      path: "cartItems.productId",
      select: "title description quantity sold",
    });
  if (!order) {
    throw next(new apiError("not match this order id"));
  }
  res.status(200).json({ message: "Get Single Order", data: order });
});

// @desc      User Get All Your Orders
// @ruote     GET /api/v1/order/
// @access    Private/User
const getUserOrders = expressAsyncHandler(async (req, res, next) => {
  const order = await orderModule
    .find({ user: req.user._id })
    .populate({ path: "user", select: "name phone email" })
    .populate({
      path: "cartItems.productId",
      select: "title description quantity sold",
    });
  if (order.length === 0) {
    throw next(new apiError("You haven't made any request before "));
  }
  res
    .status(200)
    .json({
      message: "Get All My Orders",
      count_orders: order.length,
      data: order,
    });
});

module.exports = {
  createOrderCash,
  getOrders,
  getSingleOrder,
  getUserOrders,
};
