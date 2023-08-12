const expressAsyncHandler = require("express-async-handler");
const UserModel = require("../modules/userModule");
const multer = require("multer");
const { storage, fileFilter } = require("../utils/uploads/singleImage");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const upload = multer({ storage, fileFilter });
const processUserImage = expressAsyncHandler(async (req, res, next) => {
  const userImageFileName = Date.now() + "-" + req.file.originalname;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/user/images/${userImageFileName}`);
  req.body.userImg = userImageFileName;
  next();
});

//  @docs   Create User
//  @Route  POST /api/v1/users
//  @access Private
const createUser = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.create(req.body);
  res.status(201).json(user);
});

//  @docs   Get All Users
//  @Route  GET /api/v1/users
//  @access Private
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const { limit } = req.query || 20;
  const users = await UserModel.find({}).limit(limit).select("-__v -slug");
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

//  @docs   Get User
//  @Route  GET /api/v1/users/:id
//  @access Private
const getUser = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//  @docs   Update User
//  @Route  PUT /api/v1/users/:id
//  @access Private
const updateUser = expressAsyncHandler(async (req, res) => {
  delete req.body.password;
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
const updateUserPassword = expressAsyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const user = await UserModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, salt),
      dateUpdatePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    user,
  });
});

// [      set fielde active false      ]
//  @docs   Delete User
//  @Route  Delete /api/v1/users/:id
//  @access Private
const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id, { new: true });
  res.status(200).json({
    success: true,
    user,
  });
});
module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  upload,
  processUserImage,
  updateUserPassword,
};
