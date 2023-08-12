const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  upload,
  processUserImage,
  updateUserPassword,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
} = require("../utils/valdiroeErrors/userValdetorError");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const { protect, allowedTo } = require("../services/authService");
const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manger"),
    upload.single("userImg"),
    processUserImage,
    createUserValidator,
    meddilewareCategorieError,
    createUser
  )
  .get(protect, allowedTo("admin", "manger"), getAllUsers);
router.route("/updatePassword/:id").put(
  updateUserPasswordValidator,
  meddilewareCategorieError,
  updateUserPassword
);
router
  .route("/:id")
  .get(
    protect,
    allowedTo("admin", "manger"),
    getUserValidator,
    meddilewareCategorieError,
    getUser
  )
  .put(
    protect,
    allowedTo("admin"),
    upload.single("userImg"),
    processUserImage,
    updateUserValidator,
    meddilewareCategorieError,
    updateUser
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteUserValidator,
    meddilewareCategorieError,
    deleteUser
  );

module.exports = router;
