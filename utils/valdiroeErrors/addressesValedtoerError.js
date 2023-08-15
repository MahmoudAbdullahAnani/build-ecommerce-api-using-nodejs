const { check } = require("express-validator");
const UserModel = require("../../modules/userModule");
const apiError = require("../apiError");

const createAddressesValedator = [
  check("alias")
    .notEmpty()
    .withMessage("enter the alias for this address")
    .custom(async (aliasBody, { req, res, next }) => {
      // check if this alias alryde in your(user) addresses
      const user = await UserModel.findById(req.user._id);
      const isSetAddressesAlias = user.addresses.filter(
        ({ alias }) => alias === aliasBody
      );
      if (isSetAddressesAlias.length !== 0) {
        throw new apiError("this address is already exists");
      }
      return true;
    }),
  check("details")
    .notEmpty()
    .withMessage("enter the alias for this address")
    .custom(async (detailsBody, { req, res, next }) => {
      // check if this alias alryde in your(user) addresses
      const user = await UserModel.findById(req.user._id);
      const isSetAddressesDetails = user.addresses.filter(
        ({ details }) => details === detailsBody
      );
      if (isSetAddressesDetails.length !== 0) {
        throw new apiError("this address is already exists");
      }
      return true;
    }),
  check("city").optional(),
  check("postalCode")
    .optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("not valid phone number for EG or SA"),
];

const removeAddressesValedator = [
  check("addressId")
    .notEmpty()
    .withMessage("this id for address must be required")
    .isMongoId()
    .withMessage("not valid this address id"),
];

module.exports = {
  createAddressesValedator,
  removeAddressesValedator,
};
