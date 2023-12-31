const { default: slugify } = require("slugify");
const categorieModule = require("./../modules/categori");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const sharp = require("sharp");
const multer = require("multer");
const { storage, fileFilter } = require("../utils/uploads/singleImage");

// const handelDF = muter.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uplodes/category/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });

const upload = multer({ storage: storage, fileFilter: fileFilter });

const imageUpload = asyncHandler(async (req, res, next) => {
  if (req.file.originalname) {
    const fileName = Date.now() + req.file.originalname;
    await sharp(req.file.buffer)
      .resize(400, 600)
      .toFormat("jpg")
      .jpeg({ quality: 90 })
      .toFile(`tmp/category/images/${fileName}`);
    req.body.image = fileName;
  }
  next();
});
// @desc  Get all subCategory in the single category
// @router  Get /api/v1/category/:categoryId/subCategory
// @acces  Public

// @desc      Get All Categorie {limit, Page}
// @route     GET /api/v1/category
// @access    Public
const getCategorie = asyncHandler(async (req, res) => {
  const page = req.query?.page || 1;
  const limit = req.query?.limit || 5;
  const skip = (page - 1) * limit;
  const data = await categorieModule.find({}).skip(skip).limit(limit);
  const dataOpj = {
    page,
    successful: data ? "true" : "false",
    isEmpty: data.length <= 0 ? "true" : "false",
    length: data.length,
    data: data,
  };
  res.json(dataOpj);
});

// @desc      Get Categorie by id
// @route     GET /api/v1/category/:id
// @access    Public
const getCategorieById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const data = await categorieModule.findById(id);
  const dataOpj = {
    successful: data ? "true" : "false",
    isEmpty: [data].length <= 0 ? "true" : "false",
    length: [data].length,
    data,
  };
  data
    ? res.status(200).json(dataOpj)
    : next(new apiError("This is Categorie is No't Found", 404));
});

// @desc      Create Categorie {name, slug}
// @route     POST /api/v1/category
// @access    Private
const postCategorie = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  req.body.slug = slugify(name);
  const result = await categorieModule.create(req.body);
  return res.status(201).json(result);
});

// @desc      Update Categorie by id
// @ruote     PUT /api/v1/category/:id
// @access    Private
const updateCategorie = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name;
  if (req.body.sulg) {
    req.body.slug = slugify(name);
  }
  const updateData = await categorieModule.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  updateData
    ? res.status(200).json(updateData)
    : next(new apiError("This is Categorie is No't ", 404));
});

// @desc      Delete Categorie by id
// @ruote     DELETE /api/v1/category/:id
// @access    Private
const deleteCategorie = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await categorieModule.findByIdAndDelete(id, { new: true });
  deleteData
    ? res.status(204).json(deleteData)
    : next(new apiError("This is Categorie is No't ", 404));
});

module.exports = {
  postCategorie,
  getCategorie,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
  imageUpload,
  upload,
};
