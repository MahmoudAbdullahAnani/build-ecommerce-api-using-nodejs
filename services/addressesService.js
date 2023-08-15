const expressAsyncHandler = require("express-async-handler");
const UserModel = require("../modules/userModule");

// @desc  Create Address for logged user
// @Route POST api/v1/addresses
// @access  Public/user-admin-manger
const createAddresses = expressAsyncHandler(async (req, res, next) => {
  const data = {
    alias: req.body.alias,
    details: req.body.details,
    phone: req.body.phone || "",
    city: req.body.city || "",
    postalCode: req.body.postalCode || "",
  };
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: data,
      },
    },
    { new: true }
  );
  res.status(200).json({ message: "inserted Address", data });
});

// @desc  Remove Address for logged user
// @Route DELETE api/v1/addresses/:addressId
// @access  Public/user-admin-manger
const removeAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({ message: "deleted Address" });
});

// @desc  Get Address for logged user
// @Route GET api/v1/addresses
// @access  Public/user-admin-manger
const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  res.status(200).json({ message: "deleted Address", data: user.addresses });
});

module.exports = {
  createAddresses,
  removeAddresses,
  getAddresses,
};
