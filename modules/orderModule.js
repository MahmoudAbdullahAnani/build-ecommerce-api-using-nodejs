const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          required: [true, "Must Enter Id For Product"],
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          lowercase: true,
        },
        price: Number,
      },
    ],
    texPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    deliverdAt: Date,
    shippingAddress: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);