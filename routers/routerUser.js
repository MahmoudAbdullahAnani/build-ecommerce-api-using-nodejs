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
const router = express.Router();

router
  .route("/")
  .post(
    upload.single("userImg"),
    processUserImage,
    createUserValidator,
    meddilewareCategorieError,
    createUser
  )
  .get(getAllUsers);
router.route("/updatePassword/:id").put(
  updateUserPasswordValidator,
  meddilewareCategorieError,
  updateUserPassword
);
router
  .route("/:id")
  .get(getUserValidator, meddilewareCategorieError, getUser)
  .put(
    upload.single("userImg"),
    processUserImage,
    updateUserValidator,
    meddilewareCategorieError,
    updateUser
  )
  .delete(deleteUserValidator, meddilewareCategorieError, deleteUser);

module.exports = router;
