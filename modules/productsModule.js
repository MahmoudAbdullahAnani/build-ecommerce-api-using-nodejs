const mongoose = require("mongoose");
const reviewModeule = require("./reviewModeule");

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
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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
const ratingsQuantity = async (doc) => {
  const reviews = await reviewModeule.find({ product: doc._id });
  doc.ratingsQuantity = reviews.length;
  return reviews.length;
};
const ratingsAverage = async (doc) => {
  const reviews = await reviewModeule.find({ product: doc._id });
  let plenary = 0;
  reviews.map((review) => {
    return (plenary += review.rating);
  });
  doc.ratingsAverage = plenary / reviews.length;
  return reviews.length;
};
productsSchema.post("init", (doc) => {
  ratingsQuantity(doc);
  ratingsAverage(doc);
  editImageCaverName(doc);
  editImagesName(doc);
});
productsSchema.post("save", (doc) => {
  ratingsQuantity(doc);
  ratingsAverage(doc);
  editImageCaverName(doc);
  editImagesName(doc);
});

productsSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const productsModel = mongoose.model("products", productsSchema);

module.exports = productsModel;
