const expressAsyncHandler = require("express-async-handler");
const cartModule = require("../modules/cartModule");
const productsModel = require("../modules/productsModule");
const apiError = require("../utils/apiError");
const couponModule = require("../modules/couponModule");

// @desc      Add Product To cart logged user
// @Route     POST /api/v1/cart
// @access    Public/user
const addProductToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, quantity = 1, color } = req.body;
  const product = await productsModel.findById(productId);
  const userHaveCart = await cartModule.findOne({ user: req.user._id });
  const cartUserNow = userHaveCart?.cartItems || [];
  const allcouponsUsing = userHaveCart?.coupons || [];
  if (quantity === 0) {
    throw next(
      new apiError("The number of products must be greater than zero", 401)
    );
  }
  // user have a cart and user action add product now and this product inserted db, check if product in db =Yes=then=> getQauntity
  const totalQauntityForProduct = product.quantity;
  let qauntityProductAddingAndInserted;
  cartUserNow.map((pro) => {
    if (pro.productId.toString() === productId) {
      qauntityProductAddingAndInserted = pro.quantity;
      return pro.quantity;
    }
  });

  // Tow Functions Handel add new product or if product exist
  const isProductInserted = cartUserNow.filter(
    (pro) => pro.productId.toString() === productId
  );
  let isErrorAdd = false;
  const addQauntity = cartUserNow.map((pro) => {
    const productQauntity = pro.quantity + quantity;
    if (pro.productId.toString() === productId) {
      productQauntity <= totalQauntityForProduct
        ? (pro.quantity += quantity)
        : (isErrorAdd = true);
    }
    return pro;
  });

  // 1) if user have a cart =No=then==> Create New Cart, =Yes=then==> insert item in cart
  // user not have a cart
  let cart = [];
  if (!userHaveCart) {
    if (quantity > totalQauntityForProduct)
      return next(
        new apiError(
          `The number of orders is very low, currently ${totalQauntityForProduct} of this product are available`,
          404
        )
      );
    cart = await cartModule.create({
      cartItems: { productId, quantity, color, price: product.price },
      totalCartPrice: product.price * quantity,
      user: req.user._id,
    });
    res.status(201).json({
      message: "Create Your Cart And Adding Product.",
      count_products: cart.cartItems.length,
      cart,
    });
  } else {
    userHaveCart.totalPriceAfterDiscount = 0;
    userHaveCart.coupons = [];
    await userHaveCart.save();
    // user have a cart and adding product in cart
    // 2) if user add a new product
    if (isProductInserted.length === 0) {
      let totalCartPrice = 0;

      const newData = [
        ...userHaveCart.cartItems,
        { productId, quantity, color, price: product.price },
      ];

      newData.map((item) => (totalCartPrice += item.price * item.quantity));
      if (quantity > totalQauntityForProduct)
        return next(
          new apiError(
            `The number of orders is very low, currently ${totalQauntityForProduct} of this product are available`,
            404
          )
        );

      cart = await cartModule
        .findOneAndUpdate(
          { user: req.user._id },
          {
            cartItems: [
              ...userHaveCart.cartItems,
              { productId, quantity, color, price: product.price },
            ],
            totalCartPrice,
          },
          { new: true }
        )
        .populate({ path: "user", select: "name phone email" });
      return res.status(201).json({
        message: "Adding Product.",
        count_products: cart.cartItems.length,
        cart,
      });
    } else {
      let totalCartPrice = 0;

      cartUserNow.map((item) => (totalCartPrice += item.price * item.quantity));
      // user have a cart and product ardye in cart
      if (isErrorAdd)
        return next(
          new apiError(
            `The number of orders is very low, currently ${totalQauntityForProduct} of this product are available`,
            404
          )
        );
      cart = await cartModule
        .findOneAndUpdate(
          { user: req.user._id },
          {
            cartItems: [...addQauntity],
            totalCartPrice,
          },
          { new: true }
        )
        .populate({ path: "user", select: "name phone email" });
      return res.status(201).json({
        message: "Adding Product For Qauntity.",
        count_products: cart.cartItems.length,
        cart,
      });
    }
  }
});

// @desc      Get All Products in cart logged user
// @Route     GET /api/v1/cart
// @access    Public/user
const getCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await cartModule
    .findOne({ user: req.user._id })
    .populate({ path: "user", select: "name phone email" })
    .populate({
      path: "cartItems.productId",
      select: "title quantity imageCover ",
    })
    .select("-__v");
  cart
    ? res.status(200).json({
        message: "successful",
        count_products: cart.cartItems.length,
        data: cart,
      })
    : next(
        new apiError(
          `You don't have a cart, create one with Add any product`,
          400
        )
      );
});

// @desc      Update Cart Product by logged user
// @Route     PUT /api/v1/cart
// @access    Public/user
const updateCart = expressAsyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { color = false, quantity = false } = req.body;
  const productUpdated = await productsModel.findById(productId);
  if (productUpdated.quantity < quantity) {
    return next(
      new apiError(
        `The number of orders is very low, currently ${productUpdated.quantity} of this product are available`,
        404
      )
    );
  }
  const cart = await cartModule.findOneAndUpdate(
    { user: req.user._id },
    {},
    { new: true }
  );
  if (quantity === 0) {
    throw next(
      new apiError("The number of products must be greater than zero", 401)
    );
  }
  const indexProductUpdate = cart.cartItems.findIndex(
    (pro) => pro.productId.toString() === productId
  );
  !cart &&
    res.status(404).json({
      status: "Error",
      message: "your not have a cart please add product.",
    });
  if (indexProductUpdate > -1) {
    if (color) {
      cart.cartItems[indexProductUpdate].color = color;
    }
    if (quantity) {
      cart.cartItems[indexProductUpdate].quantity = quantity;
      let updateTotalCartPrice = 0;
      cart.cartItems.forEach((pro) => {
        return (updateTotalCartPrice += pro.price * pro.quantity);
      });
      cart.totalCartPrice = updateTotalCartPrice;
    }
    await cart.save();
    res.status(200).json({
      message: "updated cart",
      count_products: cart.cartItems.length,
      data: cart,
    });
  } else {
    res.status(404).json({
      status: "Error",
      message: "not found this product.",
    });
  }
});

// @desc      Delete Product For My Cart by logged user
// @Route     DELETE /api/v1/cart
// @access    Public/user
const deleteProductInCart = expressAsyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const mainCart = await cartModule.findOne({ user: req.user._id });
  const productRemove = await productsModel.findById(productId);
  // const newCartItems = mainCart.cartItems.filter(
  //   (pro) => pro.productId.toString() !== productId
  // );
  // const cart = await cartModule.findOneAndUpdate(
  //   { user: req.user._id },
  //   { cartItems: [...newCartItems] },
  //   { new: true }
  // );
  // mainCart
  //   ? res.status(201).json({
  //       message: "inserted",
  //       count_products: cart.cartItems.length,
  //       data: cart,
  //     })
  //   : next(new apiError("Tour Not Have a Cart.", 404));
  // Logic Two ♦♣♠•◘○♥
  const qauntityProductRemove = mainCart.cartItems.filter((product) => {
    if (product.productId.toString() === productId) {
      return product.quantity;
    }
  });
  console.log(qauntityProductRemove);
  if (qauntityProductRemove.length === 0) {
    throw next(new apiError("not found this product in your cart", 404));
  }
  const cart = await cartModule.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { productId: productId } },
      totalCartPrice:
        mainCart.totalCartPrice -
        productRemove.price * qauntityProductRemove[0].quantity,
    },
    { new: true }
  );
  cart
    ? res.status(201).json({
        message: "inserted",
        count_products: cart.cartItems.length,
        data: cart,
      })
    : next(new apiError("Tour Not Have a Cart.", 404));
});

// @desc      Clear All Products
// @Route     Delete /api/v1/cart
// @access    Public/user
const clearProducts = expressAsyncHandler(async (req, res, next) => {
  const cart = await cartModule.findOneAndUpdate(
    { user: req.user._id },
    {
      cartItems: [],
      totalCartPrice: 0,
      totalPriceAfterDiscount: 0,
      coupons: [],
    }
  );
  if (!cart) {
    throw next(new apiError("Login Again or You Not Have a cart.", 404));
  }
  res.status(204).json({ message: "Cleared Your Cart.", data: cart });
});

// @desc      Apply Coupone
// @Route     POST /api/v1/cart/coupon
// @access    Public/user
const applyCoupon = expressAsyncHandler(async (req, res, next) => {
  const { couponName } = req.body;
  const coupon = await couponModule.findOne({
    name: couponName.toUpperCase(),
    expirdate: { $gt: Date.now() },
  });

  // check if not found this coupon or expired coupon
  if (!coupon) {
    return res
      .status(404)
      .json({ status: "Error", message: "not fount this coupone or expired" });
  }

  const cart = await cartModule.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { coupons: coupon.name.toUpperCase() } }
  );
  if (!cart)
    return res.status(404).json({
      status: "Error",
      message: "you not have cart now you can add product.",
    });

  let isUsing = false;
  const coupons = cart.coupons;
  coupons.map((nameCoupon) => {
    if (nameCoupon.toUpperCase() === couponName.toUpperCase()) {
      return (isUsing = true);
    }
  });

  if (isUsing) {
    return res.status(404).json({
      status: "Error",
      message: "You have used this coupon before",
    });
  }

  const totalPrice = cart.totalCartPrice;
  const priceDicount = (totalPrice * coupon.discount) / 100;
  const totalPriceAfterDiscount = totalPrice - priceDicount;
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();
  res.status(200).json({
    message: "discount",
    count_products: cart.cartItems.length,
    data: cart,
  });
});

module.exports = {
  addProductToCart,
  getCart,
  deleteProductInCart,
  updateCart,
  clearProducts,
  applyCoupon,
};
