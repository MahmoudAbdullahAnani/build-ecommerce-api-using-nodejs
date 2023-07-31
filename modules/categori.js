const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "this is filde is a required"],
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const categorieModel = mongoose.model("Categorie", categorieSchema);

module.exports = categorieModel;
