const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const UserModel = require("../../modules/userModule");
const apiError = require("../apiError");
const bcrypt = require("bcryptjs");

const createUserValidator = [
  // validator name
  check("name")
    .notEmpty()
    .withMessage("the name is must be required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long")
    .custom((name, { req }) => {
      if (name) {
        req.body.slug = slugify(name);
      }
      return true;
    }),
  // validator phone
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only Egyptian and Saudi numbers are accepted"),
  // validator email
  check("email")
    .notEmpty()
    .withMessage("the email is must be required")
    .isEmail()
    .withMessage("email must be valid")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new apiError("email already exists");
      }
      return true;
    }),
  // validator password
  check("password")
    .notEmpty()
    .withMessage("the password is must be required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  // validator role
  check("role")
    .notEmpty()
    .withMessage("the role is must be required")
    .isIn(["admin", "user", "manger"])
    .withMessage("role must be admin or user or manger"),
  // validator userImg
  check("userImg").optional(),
];
const getUserValidator = [check("id").notEmpty().withMessage("id is required")];
const updateUserValidator = [
  check("id").notEmpty().withMessage("id is required"),
];
const deleteUserValidator = [
  check("id").notEmpty().withMessage("id is required"),
];
const updateUserPasswordValidator = [
  // validator id
  check("id").notEmpty().withMessage("id is required"),
  // validator currantPassword
  check("currantPassword")
    .notEmpty()
    .withMessage("the currant password is required")
    .isLength({ min: 6 })
    .withMessage("the currant password is vert short")
    .custom(async (currantPassword, { req }) => {
      if (currantPassword) {
        const user = await UserModel.findById(req.params.id);
        if (user) {
          const isCurrantPassword = await bcrypt.compare(
            currantPassword,
            user.password
          );
          if (!isCurrantPassword) {
            throw new apiError("currant password is wrong");
          }
        }
      }
    }),
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
  // validator newPassword
  check("password")
    .notEmpty()
    .withMessage("the new password is required")
    .isLength({ min: 6 })
    .withMessage("the new password is vert short"),
];
module.exports = {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
};
