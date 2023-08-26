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
    throw next(new apiError("You haven't made any request before", 404));
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

    client_reference_id: req.user._id.toString(),
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ message: "Created Checkout Session", session });
});

const checkoutCompletedService = expressAsyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpoint_checkout_completed_secret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the event
  const OrderData = await getAndCalcOrder(req, res);
  const cart = OrderData.cart;
  if (event.type === "checkout.session.completed") {
    const checkoutSessionCompleted = event.data.object;
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer-1')
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer-2')
    console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer-3')
    // Then define and call a function to handle the event checkout.session.completed
    // 1) create new order (typeMethodPay = 'card')
    console.log("line One cart", cart);
    console.log("line One OrderData.cart", OrderData.cart);
    const order = await orderModule.create({
      user: checkoutSessionCompleted.client_reference_id,
      cartItems: OrderData.cart.cartItems,
      texPrice: OrderData.texPrice,
      shippingPrice: OrderData.shippingPrice,
      totalOrderPrice: OrderData.totalOrderPrice,
      paymentMethodType: "card",
      isPaid: true,
      paidAt: Date.now(),
      shippingAddress: checkoutSessionCompleted.metadata,
    });
    // 2) decremant For The Qauntity And Dicremant For The Sold And Clear User Cart
    console.log("line Two cart", cart);
    console.log("line Two OrderData.cart", OrderData.cart);

    const bulkAction = cart.cartItems.map((product) => ({
      updateOne: {
        filter: { _id: product.productId },
        update: {
          $inc: { quantity: -product.quantity, sold: +product.quantity },
        },
      },
    }));
    await productsModel.bulkWrite(bulkAction, {});
    // 3) clear cart
    await cartModule.deleteMany({
      user: checkoutSessionCompleted.client_reference_id,
    });
    return res.status(201).json({
      status: "saccess",
      message: "Card Payid",
      count_products: order.cartItems.length,
      data: order,
    });
  }
  // is any Error
  return res.status(404).json({ status: "Error", message: "Bad Card Payid" });
});

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

 {
  id: 'cs_test_a1funp5Z6SU2XqgBut0rkQRlgXFFWzGn0Ksms2SohrRsnxCTIPy2hiV11I',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 12560,
  amount_total: 12560,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://octopus-shop.cyclic.cloud/cart?canceled=true',
  client_reference_id: '64e81964e0572b0a5185367c',
  consent: null,
  consent_collection: null,
  created: 1693038498,
  currency: 'egp',
  currency_conversion: null,
  custom_fields: [],
  custom_text: { shipping_address: null, submit: null },
  customer: null,
  customer_creation: 'if_required',
  customer_details: {
    address: {
      city: null,
      country: 'EG',
      line1: null,
      line2: null,
      postal_code: null,
      state: null
    },
    email: 'ahmed1@gmail.com',
    name: 'Ahmed Abdullah',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: 'ahmed1@gmail.com',
  expires_at: 1693124897,
  invoice: null,
  invoice_creation: {
    enabled: false,
    invoice_data: {
      account_tax_ids: null,
      custom_fields: null,
      description: null,
      footer: null,
      metadata: {},
      rendering_options: null
    }
  },
  livemode: false,
  locale: null,
  metadata: { details: 'الرحمانية/ ميت غمر /دقهلية', alias: 'الرحمانية' },
  mode: 'payment',
  payment_intent: 'pi_3NjHs1DLxPO17Qwj1qhjoifS',
  payment_link: null,
  payment_method_collection: 'if_required',
  payment_method_options: {},
  payment_method_types: [ 'card' ],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  shipping_options: [],
  status: 'complete',
  submit_type: null,
  subscription: null,
  success_url: 'http://octopus-shop.cyclic.cloud/home?success=true',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: null
}

*/
