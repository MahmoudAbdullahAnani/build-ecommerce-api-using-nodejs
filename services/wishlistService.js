const expressAsyncHandler = require("express-async-handler");
const userModule = require("../modules/userModule");

// @desc    Create Wishlist To User
// @Route    POST api/v1/wishlist
// @acces    public/user
const createWishlist = expressAsyncHandler(async (req, res, next) => {
  // 1) find and update user to wishlist ==> $addToSet
  const user = await userModule
    .findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      { new: true }
    )
    .populate({
      path: "wishlist",
      select: "title description quantity imageCover ",
    })
    .select("-__v");
  res
    .status(201)
    .json({ message: "added product to your wishlist", data: user });
});

// @desc    Remove Wishlist To User
// @Route    DELET api/v1/wishlist
// @acces    public/user
const removeWishlist = expressAsyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const user = await userModule.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Removed this wishlist", wishlist: user.wishlist });
});

const getMyWishlist = expressAsyncHandler(async (req, res, next) => {
  const userWishlist = await userModule
    .findById(req.user._id)
    .select("wishlist name")
    .populate({
      path: "wishlist",
      select: "title description quantity imageCover",
    });
  res.status(200).json({ count: userWishlist.length, data: userWishlist });
});

module.exports = {
  createWishlist,
  removeWishlist,
  getMyWishlist,
};
