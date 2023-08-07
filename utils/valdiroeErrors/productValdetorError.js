const { check } = require("express-validator");
const categorieModel = require("../../modules/categori");
const SubCategoryMudels = require("../../modules/subCategory");
const getValdetorProductById = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const updataValdetorProduct = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const deleteValdetorProduct = [
  check("id").isMongoId().withMessage("this id is not defind"),
];
const createValdetorProduct = [
  check("title")
    .notEmpty()
    .withMessage("the title is requred")
    .isLength({ min: 3 })
    .withMessage("this name is very short"),
  check("description")
    .notEmpty()
    .withMessage("the description is requred")
    .isLength({ min: 20 })
    .withMessage("This description is very short"),
  check("quantity")
    .notEmpty()
    .withMessage("the quantity is requred")
    .isLength({ min: 1 })
    .withMessage("less than the minimum")
    .isLength({ max: 500 })
    .withMessage("more than the maximum"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product Quentity mast be a number"),
  check("price")
    .notEmpty()
    .withMessage("the price is requred")
    .isLength({ min: 1 })
    .withMessage("less than the minimum")
    .isLength({ max: 20000 })
    .withMessage("more than the maximum"),
  check("priceAfterDiscount")
    .optional()
    .isLength({ min: 1 })
    .withMessage("less than the minimum")
    .isLength({ max: 20000 })
    .withMessage("more than the maximum")
    .custom((val, { req }) => {
      if (val >= req.body.price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("color")
    .optional()
    .isArray()
    .withMessage("It should be a matrix of colors"),
  check("imageCover")
    .notEmpty()
    .withMessage("There must be image cover for product"),
  check("images").optional().isArray().withMessage("It should be a matrix of images"),
  // this field is a check if in my db or not
  check("category")
    .notEmpty()
    .withMessage("the category is requred")
    .isMongoId()
    .withMessage("this id is not defind")
    .custom((categoryId) =>
      categorieModel.findById(categoryId).then((result) => {
        if (!result) {
          console.log(result);
          return Promise.reject(new Error("this category id is not defind"));
        }
        return true;
      })
    ),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("invalid mongo id")
    // هل السب كاتيجوري دي موجوده في الجدول بتاعها ولا لأ و ان كانت واحدة منهم علي الاقل مش موجودة اعمل خطأ
    .custom((subCategorys) => {
      SubCategoryMudels.find({ _id: { $exists: true, $in: subCategorys }}).then((reuslt) => {
        if (reuslt.length < 1 || reuslt.length !== subCategorys.length) {
          return console.log(reuslt);
          // return Promise.reject(new Error("this subCategory id is not defind"));
        }
        return true;
      });
    }),
  // هل السب كاتيجوري دي موجوده في الجدول بتاعها ولا لأ و ان كانت واحدة منهم علي الاقل مش موجودة اعمل خطأ

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
];
module.exports = {
  getValdetorProductById,
  updataValdetorProduct,
  deleteValdetorProduct,
  createValdetorProduct,
};
