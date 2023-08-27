const { check } = require("express-validator");
const UserModel = require("../../modules/userModule");
const { default: slugify } = require("slugify");
const apiError = require("../apiError");

const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("the name is required")
    .custom(async (name, { req }) => {
      const user = await UserModel.find({ name });
      if (user.length > 0) {
        throw new Error("name user already exists");
      }
    }),
  check("email")
    .notEmpty()
    .withMessage("the email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email) => {
      const user = await UserModel.find({ email });
      if (user.length > 0) {
        throw new Error("this email already in using");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("the password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("the confirm password is required")
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("passwords do not match");
      }
    }),
];
const signinValidator = [
  check("email")
    .notEmpty()
    .withMessage("the email is required")
    .isEmail()
    .withMessage("invalid email"),
  check("password")
    .notEmpty()
    .withMessage("the password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
];
const restPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email must be required")
    .isEmail()
    .withMessage("this email not valide"),
];
const verifyCodeValidator = [
  check("code")
    .notEmpty()
    .withMessage("the code rest password is required!")
    .isLength({ min: 5 })
    .withMessage("the code length is 5 char!")
    .isLength({ max: 5 })
    .withMessage("the code length is 5 char!"),
];
const resetPasswordValidator = [
  // validator newPassword
  check("password")
    .notEmpty()
    .withMessage("the new password is required")
    .isLength({ min: 6 })
    .withMessage("the new password is vert short"),
  // validator confirmPassword
  check("confirmPassword")
    .notEmpty()
    .withMessage("the confirm password is required")
    .isLength({ min: 6 })
    .withMessage("the confirm password is vert short")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new apiError("new password and confirm password must be same");
      }
      return true;
    }),
];
const updataMyDateValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  check("phone")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number"),
];
module.exports = {
  signupValidator,
  signinValidator,
  restPasswordValidator,
  verifyCodeValidator,
  resetPasswordValidator,
  updataMyDateValidator,
};
