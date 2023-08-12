const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      trim: true,
      minlength: [3, "There is text review is very short"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
