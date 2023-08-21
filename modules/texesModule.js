const { default: mongoose } = require("mongoose");

const texesSchema = new mongoose.Schema(
  {
    texPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("texes", texesSchema);

