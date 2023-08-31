const { default: mongoose } = require("mongoose");

const reqProductSchema = new mongoose.Schema(
  {
    titleNeed: {
      type: String,
      required: true,
    },
    details: String,
    qauntity: Number,
    category: String,
    user: {
      type: mongoose.Types.ObjectId,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("reqProduct", reqProductSchema);