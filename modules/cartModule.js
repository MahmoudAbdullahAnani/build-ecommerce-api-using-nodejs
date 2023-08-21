const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
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
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    coupons: [String],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
