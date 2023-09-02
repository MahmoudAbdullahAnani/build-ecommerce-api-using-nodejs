const expressAsyncHandler = require("express-async-handler");

const apiError = require("../utils/apiError");
const suppliersModule = require("../modules/suppliers");

// All Pirmatiens Have a admin and manger
// @desc    Add new suppliers
// @Router  POST /api/v1/suppliers
// @Access  Private/Admin-Manger
const addSuppliers = expressAsyncHandler(async (req, res, next) => {
  if (!req.body.name) {
    throw next(new apiError("Must be Enter Name suppliers", 400));
  }
  const suppliers = await suppliersModule.create(req.body);
  res.status(201).json({ message: "saccess", data: suppliers });
});

// @desc    Update suppliers
// @Router  PUT /api/v1/suppliers/:suppliersId
// @Access  Private/Admin-Manger
const updateSuppliers = expressAsyncHandler(async (req, res, next) => {
  if (!req.body.name) {
    throw next(new apiError("Must be Enter Name suppliers", 400));
  }
  if (!req.params.suppliersId) {
    throw next(new apiError("Must be Enter params suppliersId", 400));
  }
  const suppliers = await suppliersModule.findByIdAndUpdate(
    req.params.suppliersId,
    req.body,
    { new: true }
  );
  if (!suppliers) {
    throw next(new apiError("invalid suppliersId", 400));
  }
  res.status(200).json({ message: "saccess", data: suppliers });
});

// @desc    Delete suppliers
// @Router  DELETE /api/v1/suppliers/:suppliersId
// @Access  Private/Admin-Manger
const deleteSuppliers = expressAsyncHandler(async (req, res, next) => {
  if (!req.params.suppliersId) {
    throw next(new apiError("Must be Enter params suppliersId", 400));
  }
  const suppliers = await suppliersModule.findByIdAndDelete(
    req.params.suppliersId
  );
  res.status(204).json({ message: "saccess", data: suppliers });
});

// @desc    Get All suppliers
// @Router  GET /api/v1/suppliers
// @Access  Private/Any-User
const getSuppliers = expressAsyncHandler(async (req, res, next) => {
  const suppliers = await suppliersModule.find({});
  res
    .status(200)
    .json({
      message: "saccess",
      suppliers_count: suppliers.length,
      data: suppliers,
    });
});

// @desc    Get spasific supplier
// @Router  GET /api/v1/suppliers/:suppliersId
// @Access  Private/Admin-Manger
const getSupplier = expressAsyncHandler(async (req, res, next) => {
  if (!req.params.suppliersId) {
    throw next(new apiError("Must be Enter params suppliersId", 400));
  }
  const suppliers = await suppliersModule.findById(req.params.suppliersId);
  if (!suppliers) {
    throw next(new apiError("not found suppliers or this id invalid", 400));
  }
  res.status(200).json({
    message: "saccess",
    data: suppliers,
  });
});

module.exports = {
  addSuppliers,
  updateSuppliers,
  deleteSuppliers,
  getSuppliers,
  getSupplier,
};
