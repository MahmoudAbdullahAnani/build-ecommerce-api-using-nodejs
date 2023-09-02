const { default: mongoose } = require("mongoose");

const suppliersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    website: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("suppliers", suppliersSchema);
