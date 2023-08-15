const { body, param } = require("express-validator");
const UserModel = require("../../modules/userModule");
const apiError = require("../apiError");

const createWishlistValedator = [
  body("productId")
    .notEmpty()
    .withMessage("The Id for Product is a reqiured")
    .isMongoId()
    .withMessage("not vaild this id"),
];

const removeWishlistValedator = [
  param("productId")
    .notEmpty()
    .withMessage("The Id for Product is a reqiured")
    .isMongoId()
    .withMessage("not vaild this id")
    .custom(async (productId, { req, res, next }) => {
      // 1- check if this productId set to wishlist in userModule if set(true) =then=> return true, if not Set(false) =then=> new error this product not set in your wishlist
      const user = await UserModel.findById(req.user._id);
      const isProductId = await Promise.all(
        user.wishlist.filter((idProduct) => idProduct === productId)
      );
      if (!isProductId) {
        throw next(new apiError(`this product id (${productId} is not found)`));
      }
      return true;
    }),
];

module.exports = {
  createWishlistValedator,
  removeWishlistValedator,
};
