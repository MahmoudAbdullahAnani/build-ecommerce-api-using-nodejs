const express = require("express");
const {
  signupValidator,
  signinValidator,
  restPasswordValidator,
  verifyCodeValidator,
  resetPasswordValidator,
  updataMyDateValidator,
} = require("../utils/valdiroeErrors/signupValdetorError");
const meddilewareCategorieError = require("../middleware/categotieErrors");
const {
  signup,
  signin,
  forgotPassword,
  verifyCode,
  resetPassword,
  protect,
} = require("../services/authService");
const {
  getMyData,
  updataMyDate,
  deleteMyAccount,
} = require("../services/userHandleDataService");
const router = express.Router();

router
  .route("/signup")
  .post(signupValidator, meddilewareCategorieError, signup);
router
  .route("/signin")
  .post(signinValidator, meddilewareCategorieError, signin);
router
  .route("/forgotPassword")
  .post(restPasswordValidator, meddilewareCategorieError, forgotPassword);
router
  .route("/verifyCode")
  .post(verifyCodeValidator, meddilewareCategorieError, verifyCode);
router
  .route("/resetPassword")
  .put(resetPasswordValidator, meddilewareCategorieError, resetPassword);

// Handle logged user Data
router.use(protect);
router
  .route("/me")
  .get(getMyData)
  .put(updataMyDateValidator, meddilewareCategorieError, updataMyDate)
  .delete(deleteMyAccount);

module.exports = router;
