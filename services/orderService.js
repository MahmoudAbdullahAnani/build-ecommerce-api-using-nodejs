const expressAsyncHandler = require("express-async-handler");
const cartModule = require("../modules/cartModule");
const productsModel = require("../modules/productsModule");
const orderModule = require("../modules/orderModule");
const texesModule = require("../modules/texesModule");
const apiError = require("../utils/apiError");

const stripe = require("stripe")(process.env.stripe_secret_key);

/*
    1- Get Price Texes ,
    2- Get Cart,
    3- Calc Total Price After Discount
  */
const getAndCalcOrder = async (req, res) => {
  // 0) Get Texes
  const texes = await texesModule.findOne({});
  const texPrice = texes.texPrice;
  const shippingPrice = texes.shippingPrice;
  // 1) Get cart by user id
  const cart = await cartModule
    .findOne({ user: req.user._id })
    .populate({ path: "cartItems.productId", select: "imageCover" });
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
  const OrderData = {
    totalOrderPrice,
    texPrice,
    shippingPrice,
    cart,
  };
  return OrderData;
};

// @desc      Create Order on my cart (cash)
// @ruote     POST /api/v1/order
// @access    Private/user
const createOrderCash = expressAsyncHandler(async (req, res, next) => {
  const OrderData = await getAndCalcOrder(req, res);
  const cart = OrderData.cart;
  // - insert new order
  const order = await orderModule.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: OrderData.totalOrderPrice,
    paymentMethodType: "cash",
    texPrice: OrderData.texPrice,
    shippingPrice: OrderData.shippingPrice,
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
const getOrders = expressAsyncHandler(async (req, res) => {
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
  res.status(200).json({
    message: "Get All My Orders",
    count_orders: order.length,
    data: order,
  });
});

// @desc      Clear Hostire Orders
// @ruote     DELETE /api/v1/order
// @access    Private/Admin-Manger
const clearOrders = expressAsyncHandler(async (req, res, next) => {
  await orderModule.deleteMany({});
  res.status(204).json({ message: "Cleared All Orders Hostire" });
});

// @desc      Create Order on my cart (Card)
// @ruote     POST /api/v1/order
// @access    Private/user
const createOrderCard = expressAsyncHandler(async (req, res, next) => {
  /*
    1- Get Price Texes ,
    2- Get Cart,
    3- Calc Total Price After Discount
  */
  const OrderData = await getAndCalcOrder(req, res);
  // const imagesCart = OrderData.cart.cartItems.map((pro) => {
  //   return pro.imageCover;
  // });
  /*
    1- Create New Session, Can User Pay By URL On This Session,
    2- If Saccess Pay On This Session ==Then=> decremant For The Qauntity And Dicremant For The Sold And Clear User Cart
  */
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "egp",
          unit_amount: OrderData.totalOrderPrice * 100,
          product_data: {
            name: "Octopus-Shop",
            description: "Purchases from the octopus",
            images: [
              `https://img.freepik.com/premium-vector/baby-octopus-logo-baby-store-baby-shop_185029-1613.jpg?w=2000`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/home?success=true`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart?canceled=true`,
    client_reference_id: OrderData.cart._id.toString(),
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ message: "Created Checkout Session", session });
});

const checkoutCompletedService = async (req, res) => {
  const endpointSecret =process.env.endpoint_checkout_completed_secret
  if (endpointSecret) {
    const sig = req.headers["stripe-signature"];

  let eventCheckOut;

  try {
    eventCheckOut = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    return res
      .status(400)
      .send(`Webhook Error(endpoint checkout-completed): ${err.message}`);
  }
}

  // Handle the event
  switch (eventCheckOut.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = eventCheckOut.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      console.log("checkoutSessionCompleted", checkoutSessionCompleted);
      break;
    // ... handle other event types
    default:
      res.status(400).send(`Unhandled event type ${eventCheckOut.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = {
  createOrderCash,
  createOrderCard,
  getOrders,
  getSingleOrder,
  getUserOrders,
  clearOrders,
  checkoutCompletedService,
};

/*
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }*/
