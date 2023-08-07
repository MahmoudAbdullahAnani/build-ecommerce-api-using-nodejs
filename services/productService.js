const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const productsModel = require("../modules/productsModule");
const multer = require("multer");
const { storage, fileFilter } = require("../utils/uploads/singleImage");
const sharp = require("sharp");

// @desc      Get All Products {limit, Page}
// @route     GET /api/v1/products
// @access    Public
const getProducts = asyncHandler(async (req, res) => {
  // 1) filter by price and ratingsAverage ( ratingsAverage , price )
  const requstQuerys = { ...req.query };
  const removeQuerys = ["limit", "page", "sort", "fields"];
  removeQuerys.forEach((item) => {
    delete requstQuerys[item];
  });
  // (ratingsAverage[gte,gt,lte,lt])
  // { price: { gts: '1099' }, ratingsAverage: { gte: '4.3' } }
  let requstQueryString = JSON.stringify(requstQuerys);
  let requstQuery = requstQueryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  requstQueryString = JSON.parse(requstQuery);

  // 2) Pagenation
  const page = req.query?.page || 1;
  const limit = req.query?.limit || 5;
  const skip = (page - 1) * limit;

  // 3) Sorting
  let sort = req.query?.sort || "-createdAt";
  const handelMoreFieldsSort = sort.split(",").join(" ");

  // 4) Fields
  let fields = req.query?.fields || "";
  const handelMoreFieldsFields = fields.split(",").join(" ");

  const mongooBuild = productsModel
    .find(requstQueryString)
    .skip(skip)
    .limit(limit)
    .sort(handelMoreFieldsSort)
    .select(handelMoreFieldsFields + "-__v");

  const data = await mongooBuild;
  // data.map((product) => {
  //   const imageCoverName = product.imageCover;
  //   delete product.imageCover;
  //   product.imageCover = `${process.env.DOMAN_NAME}product/images/${imageCoverName}`;
  //   return product;
  // });
  const dataOpj = {
    page,
    successful: data ? "true" : "false",
    isEmpty: data.length <= 0 ? "true" : "false",
    length: data.length,
    data: data,
  };
  res.json(dataOpj);
});

// @desc      Get product by id
// @route     GET /api/v1/products/:id
// @access    Public
const getPruductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const data = await productsModel.findById(id);
  const dataOpj = {
    successful: data ? "true" : "false",
    isEmpty: [data].length <= 0 ? "true" : "false",
    length: [data].length,
    data,
  };
  data
    ? res.status(200).json(dataOpj)
    : next(new apiError("This is product is No't Found", 404));
});

const upload = multer({ storage: storage, fileFilter: fileFilter });
const reProcessImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCaverFileName =
      Date.now() + "-" + req.files.imageCover[0].originalname;
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 600)
      .toFormat("jpg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/product/images/${imageCaverFileName}`);
    req.body.imageCover = imageCaverFileName;
  }
  if (req.files.images) {
    const images = [];
    await Promise.all(
      req.files.images.map((img) => {
        const imageFileName = Date.now() + "-" + img.originalname;
        sharp(img.buffer)
          .resize(500, 600)
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/product/images/${imageFileName}`);
        return images.push(imageFileName);
      })
    );
    req.body.images = images;
  }
  next();
});

// @desc      Create products {name, slug}
// @route     POST /api/v1/products
// @access    Private
const postProducts = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  if (!req.body.slug) {
    req.body.slug = slugify(req.body.title);
  }
  const result = await productsModel.create(req.body);
  return res.status(201).json(result);
});

// @desc      Update product by id
// @ruote     PUT /api/v1/products/:id
// @access    Private
const updateProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = await productsModel.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  updateData
    ? res.status(200).json(updateData)
    : next(new apiError("This is product is No't ", 404));
});

// @desc      Delete product by id
// @ruote     DELETE /api/v1/products/:id
// @access    Private
const deleteProducat = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await productsModel.findByIdAndDelete(id, { new: true });
  deleteData
    ? res.status(204).json(deleteData)
    : next(new apiError("This is product is No't ", 404));
});

module.exports = {
  getProducts,
  getPruductById,
  postProducts,
  updateProducts,
  deleteProducat,
  upload,
  reProcessImages,
};
