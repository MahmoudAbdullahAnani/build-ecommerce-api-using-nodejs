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
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorieSchema.post("init", (doc) => {
  if (doc.image) {
    const fileName = doc.image
    doc.image = `${process.env.DOMAN_NAME}category/images/${fileName}`;
  }
});

const categorieModel = mongoose.model("Categorie", categorieSchema);

module.exports = categorieModel;
