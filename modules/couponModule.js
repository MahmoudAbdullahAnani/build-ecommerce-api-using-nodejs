const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: [true, "The Name Coupone Must Be Reqiured."],
      unique: [true, "the coupon name must be unique."],
    },
    expirdate: {
      type: String,
      required: [true, "The Expir Time With Coupone Must Be Reqiured."],
    },
    discount: {
      type: Number,
      minLength: [0, "The Discount It can't be less than zero."],
      required: [true, "The Expir Time With Coupone Must Be Reqiured."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", couponSchema);