const asyncHander = require("express-async-handler");
const SubCategoryMudels = require("../modules/subCategory");
const { default: slugify } = require("slugify");
const apiError = require("../utils/apiError");

// setCategoryIdInBody = (req, res, next) => {
//   console.log(req.params.categoryId);
//   if (!req.body.categori) req.body.categori = req.params.categoryId;
//   next();
// };

// @docs    Create Sub Category
// @Router  POST /api/v1/subcategory
// @access  Private
const createSubCategory = asyncHander(async (req, res) => {
    if (!req.body.categori) req.body.categori = req.params.categoryId;
  const { name, categori } = req.body;
  const subCategory = await SubCategoryMudels.create({
    name,
    slug: slugify(name),
    categori,
  });
  res.status(201).json({
    success: true,
    message: "Sub Category Created Successfully",
    data: subCategory,
  });
});

// @docs    Read All Sub Category
// @Router  GET /api/v1/subcategory
// @access  Public
const getSubCategory = asyncHander(async (req, res) => {
  const page = req.query?.page || 1;
  const limit = req.query?.limit || 5;
  const skip = (page - 1) * limit;
  let filterSubcategory = {};
  if (req.params.categoryId) {
    filterSubcategory.categori = req.params.categoryId;
  }
  const data = await SubCategoryMudels.find(filterSubcategory)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "categori",
      select: "name ",
    });
  const dataOpj = {
    page,
    successful: data ? "true" : "false",
    isEmpty: data.length <= 0 ? "true" : "false",
    length: data.length,
    data: data,
  };
  res.json(dataOpj);
});
// @docs    Read by id Sub Category
// @Router  GET /api/v1/subcategory/:id
// @access  Public
const getSubCategoryById = asyncHander(async (req, res, next) => {
  const id = req.params.id;
  const data = await SubCategoryMudels.findById(id);
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

// @desc      Update sub Categorie by id
// @ruote     PUT /api/v1/subcategory/:id
// @access    Private
const updateSubCategorie = asyncHander(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name;
  const categori = req.body.categori;
  const updateData = await SubCategoryMudels.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), categori },
    { new: true }
  );
  updateData
    ? res.status(200).json(updateData)
    : next(new apiError("This is sub Categorie is No't ", 404));
});

// @desc      Delete sub Categorie by id
// @ruote     DELETE /api/v1/subcategory/:id
// @access    Private
const deleteSubCategorie = asyncHander(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await SubCategoryMudels.findByIdAndDelete(id, {
    new: true,
  });
  deleteData
    ? res.status(204).json(deleteData)
    : next(new apiError("This is sub Categorie is No't ", 404));
});

module.exports = {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  updateSubCategorie,
  deleteSubCategorie,
  // MeddilWare
  // setCategoryIdInBody,
};
