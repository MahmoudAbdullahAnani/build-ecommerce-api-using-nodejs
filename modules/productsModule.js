const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "this is filde is a required"],
      unique: true,
      trim: true,
      minlength: [3, "This title is very short"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "this is filde is a required"],
      trim: true,
      minlength: [20, "This description is very short"],
    },
    quantity: {
      type: Number,
      required: [true, "this is filde is a required"],
      min: [1, "less than the minimum"],
      max: [500, "more than the maximum"],
      default: 1,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "the price is a required"],
      min: [1, "less than the minimum"],
      max: [20000, "more than the maximum"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [1, "less than the minimum"],
      max: [20000, "more than the maximum"],
    },
    color: [String],
    imageCover: {
      type: String,
      required: [true, "this is filde is a required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: [true, "this is filde is a required"],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "less than the minimum"],
      max: [5, "more than the maximum"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const editImageCaverName = (doc) => {
  if (doc.imageCover) {
    const fileName = doc.imageCover;
    doc.imageCover = `${process.env.DOMAN_NAME}product/images/${fileName}`;
  }
};
const editImagesName = (doc) => {
  if (doc.images) {
    // const fileName = doc.imageCover;
    // doc.imageCover = `${process.env.DOMAN_NAME}product/images/${fileName}`;
    doc.images = doc.images.map((image) => {
      return `${process.env.DOMAN_NAME}product/images/${image}`;
    });
  }
};
productsSchema.post("init", (doc) => {
  editImageCaverName(doc);
  editImagesName(doc);
});
productsSchema.post("save", (doc) => {
  editImageCaverName(doc);
  editImagesName(doc);
});

const productsModel = mongoose.model("products", productsSchema);

module.exports = productsModel;
